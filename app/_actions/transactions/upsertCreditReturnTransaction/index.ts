"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Prisma, TransactionPaymentMethod } from "@prisma/client";
import { upsertCreditReturnTransactionSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { updateInvoiceAmount } from "@actions/invoices/updateInvoiceAmount";
import getTransaction from "@data/getTransaction";
import { findOrOpenInvoice } from "@components/transaction/forms/ExpenseForm/handleCreditTransaction/utils";

type UpsertCreditReturnTransactionParams = {
  transactionId?: string;
  name: string;
  amount: number;
  categoryId: string;
  cardId: string;
  invoiceMonth: number;
  invoiceYear: number;
  date: Date;
};

type AdditionalParams = {
  revalidate?: boolean;
  client?: Omit<Prisma.TransactionClient, "$transaction">;
};

export const upsertCreditReturnTransaction = async (
  params: UpsertCreditReturnTransactionParams,
  additionalParams?: AdditionalParams,
) => {
  upsertCreditReturnTransactionSchema.parse(params);

  const { revalidate = true, client } = additionalParams ?? {};

  // Uses the transactional client, if provided, or the default client.
  const prismaClient = client ?? db;

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const revalidatePaths = () => {
    if (revalidate) {
      console.log("revalidating");
      revalidatePath("/");
      revalidatePath("/transactions");
      revalidatePath("/credit-cards/details", "page");
    }
  };

  // Destructures and creates a copy of `params` to avoid direct mutation
  const { invoiceMonth, invoiceYear, ...transactionData } = params;

  // Validate invoice exists and is not PAID
  const invoice = await findOrOpenInvoice({
    userId,
    cardId: transactionData.cardId,
    invoiceMonth: invoiceMonth,
    invoiceYear: invoiceYear,
    client: prismaClient,
  });

  const existingTransaction = await getTransaction({
    id: transactionData.transactionId,
    client: prismaClient,
  });

  // If there is no previous transaction
  if (!existingTransaction) {
    // Decrease invoice amount for the return
    await updateInvoiceAmount({
      operation: "decrement",
      amount: transactionData.amount,
      invoiceId: invoice.id,
      transaction: prismaClient,
    });

    // Creates the return transaction
    await prismaClient.transaction.create({
      data: {
        ...transactionData,
        userId,
        type: "GAIN",
        paymentMethod: TransactionPaymentMethod.CREDIT,
        invoiceId: invoice.id,
      },
    });

    revalidatePaths();
    return;
  }

  // For existing transactions, calculate the difference
  const difference =
    transactionData.amount - Number(existingTransaction.amount);

  // If the invoice has changed
  if (existingTransaction.invoiceId !== invoice.id) {
    // Reverses the impact on the old invoice (increment back)
    if (existingTransaction.invoiceId) {
      await updateInvoiceAmount({
        operation: "increment",
        amount: Number(existingTransaction.amount),
        invoiceId: existingTransaction.invoiceId,
        transaction: prismaClient,
      });
    }

    // Applies the impact on the new invoice (decrement)
    await updateInvoiceAmount({
      operation: "decrement",
      amount: transactionData.amount,
      invoiceId: invoice.id,
      transaction: prismaClient,
    });
  } else if (difference !== 0) {
    // If it's the same invoice but the amount has changed
    const operation = difference > 0 ? "decrement" : "increment";
    await updateInvoiceAmount({
      operation,
      amount: Math.abs(difference),
      invoiceId: invoice.id,
      transaction: prismaClient,
    });
  }

  // Updates the transaction
  await prismaClient.transaction.update({
    where: { id: transactionData.transactionId },
    data: {
      ...transactionData,
      userId,
      type: "GAIN",
      paymentMethod: TransactionPaymentMethod.CREDIT,
      invoiceId: invoice.id,
    },
  });

  revalidatePaths();
};
