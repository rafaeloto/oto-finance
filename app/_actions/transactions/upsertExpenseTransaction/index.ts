"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {
  ExpenseTransactionCategory,
  Prisma,
  TransactionPaymentMethod,
} from "@prisma/client";
import { upsertExpenseTransactionSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { updateSingleAccountBalance } from "@actions/accounts/updateBalance";
import { updateInvoiceAmount } from "@actions/invoices/updateInvoiceAmount";
import getTransaction from "@data/getTransaction";

interface UpsertExpenseTransactionParams {
  id?: string;
  name: string;
  amount: number;
  expenseCategory: ExpenseTransactionCategory;
  paymentMethod: TransactionPaymentMethod;
  accountId?: string;
  cardId?: string;
  invoiceId?: string;
  installmentId?: string;
  installmentNumber?: number;
  installmentsTotal?: number;
  date: Date;
}

type AdditionalParams = {
  revalidate?: boolean;
  client?: Omit<Prisma.TransactionClient, "$transaction">;
};

export const upsertExpenseTransaction = async (
  params: UpsertExpenseTransactionParams,
  additionalParams?: AdditionalParams,
) => {
  upsertExpenseTransactionSchema.parse(params);

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
      revalidatePath("/accounts");
      revalidatePath("/credit-cards/details", "page");
    }
  };

  const existingTransaction = await getTransaction({
    id: params.id,
    client: prismaClient,
  });

  const isExistingDebit =
    existingTransaction?.paymentMethod === TransactionPaymentMethod.DEBIT;
  const isExistingCredit =
    existingTransaction?.paymentMethod === TransactionPaymentMethod.CREDIT;
  const isNewDebit = params?.paymentMethod === TransactionPaymentMethod.DEBIT;
  const isNewCredit = params?.paymentMethod === TransactionPaymentMethod.CREDIT;

  // Create a copy of `params` to avoid direct mutation
  const updatedParams = { ...params };

  // If there is no previous transaction
  if (!existingTransaction) {
    if (isNewCredit && updatedParams.invoiceId) {
      await updateInvoiceAmount({
        operation: "increment",
        amount: updatedParams.amount,
        invoiceId: updatedParams.invoiceId,
        transaction: prismaClient,
      });
    } else if (isNewDebit && updatedParams.accountId) {
      await updateSingleAccountBalance({
        operation: "decrement",
        amount: updatedParams.amount,
        accountId: updatedParams.accountId,
        transaction: prismaClient,
      });
    }

    // Criar a transação
    await prismaClient.transaction.create({
      data: { ...updatedParams, userId, type: "EXPENSE" },
    });

    revalidatePaths();
    return;
  }

  // If the previous transaction is debit and the new one is credit
  if (isExistingDebit && isNewCredit) {
    // Reverse the impact on the account balance
    if (existingTransaction.accountId) {
      await updateSingleAccountBalance({
        operation: "increment",
        amount: Number(existingTransaction.amount),
        accountId: existingTransaction.accountId,
        transaction: prismaClient,
      });
    }

    // Apply the impact on the credit card invoice
    if (updatedParams.invoiceId) {
      await updateInvoiceAmount({
        operation: "increment",
        amount: updatedParams.amount,
        invoiceId: updatedParams.invoiceId!,
        transaction: prismaClient,
      });
    }

    // Ensure the removal of the the `accountId` field
    updatedParams.accountId = undefined;
  }
  // If the previous transaction is credit and the new one is debit
  else if (isExistingCredit && isNewDebit) {
    // Reverse the impact on the invoice amount
    if (existingTransaction.invoiceId) {
      await updateInvoiceAmount({
        operation: "decrement",
        amount: Number(existingTransaction.amount),
        invoiceId: existingTransaction.invoiceId,
        transaction: prismaClient,
      });
    }

    // Apply the impact on the account balance
    if (updatedParams.accountId) {
      await updateSingleAccountBalance({
        operation: "decrement",
        amount: updatedParams.amount,
        accountId: updatedParams.accountId!,
        transaction: prismaClient,
      });
    }

    // Ensure the removal of the `cardId` and `invoiceId` fields
    updatedParams.cardId = undefined;
    updatedParams.invoiceId = undefined;
  }
  // If the payment method has not changed, apply normal adjustments
  else {
    const difference =
      updatedParams.amount - Number(existingTransaction?.amount);

    if (isNewCredit) {
      // If the invoice has changed
      if (existingTransaction?.invoiceId !== updatedParams.invoiceId) {
        // Reverse the impact on the old invoice
        if (existingTransaction?.invoiceId) {
          await updateInvoiceAmount({
            operation: "decrement",
            amount: Number(existingTransaction.amount),
            invoiceId: existingTransaction.invoiceId,
            transaction: prismaClient,
          });
        }

        // Apply the impact on the new invoice
        await updateInvoiceAmount({
          operation: "increment",
          amount: updatedParams.amount,
          invoiceId: updatedParams.invoiceId!,
          transaction: prismaClient,
        });
      } else if (difference !== 0) {
        // If it's the same invoice but the amount has changed
        await updateInvoiceAmount({
          operation: difference > 0 ? "increment" : "decrement",
          amount: Math.abs(difference),
          invoiceId: updatedParams.invoiceId!,
          transaction: prismaClient,
        });
      }
    } else if (isNewDebit) {
      // If the account has changed
      if (existingTransaction?.accountId !== updatedParams.accountId) {
        // Reverse the balance on old account
        if (existingTransaction?.accountId) {
          await updateSingleAccountBalance({
            operation: "increment",
            amount: Number(existingTransaction.amount),
            accountId: existingTransaction.accountId,
            transaction: prismaClient,
          });
        }

        // Apply the impact on the new account
        await updateSingleAccountBalance({
          operation: "decrement",
          amount: updatedParams.amount,
          accountId: updatedParams.accountId!,
          transaction: prismaClient,
        });
      } else if (difference !== 0) {
        // If it's the same account but the amount has changed
        await updateSingleAccountBalance({
          operation: difference > 0 ? "decrement" : "increment",
          amount: Math.abs(difference),
          accountId: updatedParams.accountId!,
          transaction: prismaClient,
        });
      }
    }
  }

  // Update the transaction
  await prismaClient.transaction.update({
    where: { id: updatedParams.id },
    data: { ...updatedParams, userId, type: "EXPENSE" },
  });

  revalidatePaths();
};
