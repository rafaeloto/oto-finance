"use server";

import { db } from "@/app/_lib/prisma";
import { DeleteTransactionSchema } from "./schema";
import { revalidatePath } from "next/cache";
import getTransaction from "@/app/_data/get-transaction";
import {
  updateAccountsBalances,
  updateSingleAccountBalance,
} from "@/app/_actions/accounts/update-balance";
import { updateInvoiceAmount } from "@/app/_actions/invoices/update-amount";

export const deleteTransaction = async ({
  transactionId,
}: DeleteTransactionSchema) => {
  // Retrieve the transaction
  const transaction = await getTransaction(transactionId);

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  const {
    amount,
    accountId,
    fromAccountId,
    toAccountId,
    invoiceId,
    investmentCategory,
  } = transaction;

  // Group all operations in a single transaction to ensure atomicity
  await db.$transaction(async (prismaClient) => {
    switch (transaction.type) {
      // Reverting the expense impact
      case "EXPENSE":
        // Reverting the debit expense: add the amount back to the account
        if (accountId) {
          await updateSingleAccountBalance({
            operation: "increment",
            amount: Number(amount),
            accountId,
            transaction: prismaClient,
          });
        } else if (invoiceId) {
          // Reverting the credit expense: remove the amount from the invoice total
          await updateInvoiceAmount({
            operation: "decrement",
            amount: Number(amount),
            invoiceId,
            transaction: prismaClient,
          });
        }
        break;

      // Reverting the gain: subtract the amount from the account
      case "GAIN":
        if (accountId) {
          await updateSingleAccountBalance({
            operation: "decrement",
            amount: Number(amount),
            accountId,
            transaction: prismaClient,
          });
        }
        break;

      // Reverting the transfer: move the amount back between the accounts
      case "TRANSFER":
        if (fromAccountId && toAccountId) {
          await updateAccountsBalances({
            amount: Number(amount),
            fromAccountId: toAccountId,
            toAccountId: fromAccountId,
            transaction: prismaClient,
          });
        }
        break;

      // Reverting the investment balance impact
      case "INVESTMENT":
        if (accountId) {
          if (investmentCategory === "INVESTMENT_NEGATIVE_RETURN") {
            // Reverting the negative return: add the amount back to the account
            await updateSingleAccountBalance({
              operation: "increment",
              amount: Number(amount),
              accountId,
              transaction: prismaClient,
            });
          } else if (investmentCategory === "INVESTMENT_POSITIVE_RETURN") {
            // Reverting the positive return: subtract the amount from the account
            await updateSingleAccountBalance({
              operation: "decrement",
              amount: Number(amount),
              accountId,
              transaction: prismaClient,
            });
          }
        }
        break;

      default:
        break;
    }

    // Delete the transaction after adjusting balances
    await prismaClient.transaction.delete({
      where: { id: transactionId },
    });
  });

  revalidatePath("/");
  revalidatePath("/transactions");
  revalidatePath("/accounts");
  revalidatePath("/credit-cards/details");
};
