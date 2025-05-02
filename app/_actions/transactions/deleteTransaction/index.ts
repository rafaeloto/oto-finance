"use server";

import { db } from "@/app/_lib/prisma";
import { DeleteTransactionSchema } from "./schema";
import { revalidatePath } from "next/cache";
import getTransaction from "@data/getTransaction";
import {
  updateAccountsBalances,
  updateSingleAccountBalance,
} from "@actions/accounts/updateBalance";
import { updateInvoiceAmount } from "@actions/invoices/updateInvoiceAmount";
import { NEGATIVE_RETURN_ID, POSITIVE_RETURN_ID } from "@constants/category";

export const deleteTransaction = async ({
  transactionId,
}: DeleteTransactionSchema) => {
  // Retrieves the transaction
  const transaction = await getTransaction({ id: transactionId });

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  const {
    amount,
    accountId,
    fromAccountId,
    toAccountId,
    invoiceId,
    categoryId,
  } = transaction;

  // Groups all operations in a single transaction to ensure atomicity
  await db.$transaction(
    async (prismaClient) => {
      switch (transaction.type) {
        // Reverting the expense impact
        case "EXPENSE":
          // Reverting the debit expense: adds the amount back to the account
          if (accountId) {
            await updateSingleAccountBalance({
              operation: "increment",
              amount: Number(amount),
              accountId,
              transaction: prismaClient,
            });
          } else if (invoiceId) {
            // Reverting the credit expense: removes the amount from the invoice total
            await updateInvoiceAmount({
              operation: "decrement",
              amount: Number(amount),
              invoiceId,
              transaction: prismaClient,
            });
          }
          break;

        // Reverting the gain: subtracts the amount from the account
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

        // Reverting the transfer: moves the amount back between the accounts
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
            if (categoryId === NEGATIVE_RETURN_ID) {
              // Reverting the negative return: adds the amount back to the account
              await updateSingleAccountBalance({
                operation: "increment",
                amount: Number(amount),
                accountId,
                transaction: prismaClient,
              });
            } else if (categoryId === POSITIVE_RETURN_ID) {
              // Reverting the positive return: subtracts the amount from the account
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

      // Deletes the transaction after adjusting balances
      await prismaClient.transaction.delete({
        where: { id: transactionId },
      });
    },
    { timeout: 60000 },
  );

  revalidatePath("/");
  revalidatePath("/transactions");
  revalidatePath("/accounts");
  revalidatePath("/credit-cards/details", "page");
};
