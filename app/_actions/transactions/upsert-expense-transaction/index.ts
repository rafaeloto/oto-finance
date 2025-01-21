"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {
  ExpenseTransactionCategory,
  TransactionPaymentMethod,
} from "@prisma/client";
import { upsertExpenseTransactionSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { updateSingleAccountBalance } from "../../accounts/update-balance";
import { updateInvoiceAmount } from "../../invoices/update-amount";
import getTransaction from "@/app/_data/get-transaction";

interface UpsertExpenseTransactionParams {
  id?: string;
  name: string;
  amount: number;
  expenseCategory: ExpenseTransactionCategory;
  paymentMethod: TransactionPaymentMethod;
  accountId?: string;
  cardId?: string;
  invoiceId?: string;
  date: Date;
}

export const upsertExpenseTransaction = async (
  params: UpsertExpenseTransactionParams,
) => {
  upsertExpenseTransactionSchema.parse(params);

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const existingTransaction = await getTransaction(params.id);

  const isExistingDebit =
    existingTransaction?.paymentMethod === TransactionPaymentMethod.DEBIT;
  const isExistingCredit =
    existingTransaction?.paymentMethod === TransactionPaymentMethod.CREDIT;
  const isNewDebit = params?.paymentMethod === TransactionPaymentMethod.DEBIT;
  const isNewCredit = params?.paymentMethod === TransactionPaymentMethod.CREDIT;

  await db.$transaction(async (transaction) => {
    // If there is no previous transaction
    if (!existingTransaction) {
      if (isNewCredit && params.invoiceId) {
        await updateInvoiceAmount({
          operation: "increment",
          amount: params.amount,
          invoiceId: params.invoiceId,
          transaction,
        });
      } else if (isNewDebit && params.accountId) {
        await updateSingleAccountBalance({
          operation: "decrement",
          amount: params.amount,
          accountId: params.accountId,
          transaction,
        });
      }

      // Criar a transação
      await transaction.transaction.create({
        data: { ...params, userId, type: "EXPENSE" },
      });
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
          transaction,
        });
      }

      // Apply the impact on the credit card invoice
      if (params.invoiceId) {
        await updateInvoiceAmount({
          operation: "increment",
          amount: params.amount,
          invoiceId: params.invoiceId!,
          transaction,
        });
      }

      // Ensure the removal of the the `accountId` field
      params.accountId = undefined;
    }
    // If the previous transaction is credit and the new one is debit
    else if (isExistingCredit && isNewDebit) {
      // Reverse the impact on the invoice amount
      if (existingTransaction.invoiceId) {
        await updateInvoiceAmount({
          operation: "decrement",
          amount: Number(existingTransaction.amount),
          invoiceId: existingTransaction.invoiceId,
          transaction,
        });
      }

      // Apply the impact on the account balance
      if (params.accountId) {
        await updateSingleAccountBalance({
          operation: "decrement",
          amount: params.amount,
          accountId: params.accountId!,
          transaction,
        });
      }

      // Ensure the removal of the `cardId` and `invoiceId` fields
      params.cardId = undefined;
      params.invoiceId = undefined;
    }
    // If the payment method has not changed, apply normal adjustments
    else {
      const difference = params.amount - Number(existingTransaction?.amount);

      if (isNewCredit) {
        // If the invoice has changed
        if (existingTransaction?.invoiceId !== params.invoiceId) {
          // Reverse the impact on the old invoice
          if (existingTransaction?.invoiceId) {
            await updateInvoiceAmount({
              operation: "decrement",
              amount: Number(existingTransaction.amount),
              invoiceId: existingTransaction.invoiceId,
              transaction,
            });
          }

          // Apply the impact on the new invoice
          await updateInvoiceAmount({
            operation: "increment",
            amount: params.amount,
            invoiceId: params.invoiceId!,
            transaction,
          });
        } else if (difference !== 0) {
          // If it's the same invoice but the amount has changed
          await updateInvoiceAmount({
            operation: difference > 0 ? "increment" : "decrement",
            amount: Math.abs(difference),
            invoiceId: params.invoiceId!,
            transaction,
          });
        }
      } else if (isNewDebit) {
        // If the account has changed
        if (existingTransaction?.accountId !== params.accountId) {
          // Reverse the balance on old account
          if (existingTransaction?.accountId) {
            await updateSingleAccountBalance({
              operation: "increment",
              amount: Number(existingTransaction.amount),
              accountId: existingTransaction.accountId,
              transaction,
            });
          }

          // Apply the impact on the new account
          await updateSingleAccountBalance({
            operation: "decrement",
            amount: params.amount,
            accountId: params.accountId!,
            transaction,
          });
        } else if (difference !== 0) {
          // If it's the same account but the amount has changed
          await updateSingleAccountBalance({
            operation: difference > 0 ? "decrement" : "increment",
            amount: Math.abs(difference),
            accountId: params.accountId!,
            transaction,
          });
        }
      }
    }

    // Atualizar a transação
    await transaction.transaction.update({
      where: { id: params.id },
      data: { ...params, userId, type: "EXPENSE" },
    });
  });

  revalidatePath("/");
  revalidatePath("/transactions");
  revalidatePath("/accounts");
  revalidatePath("/credit-cards/details");
};
