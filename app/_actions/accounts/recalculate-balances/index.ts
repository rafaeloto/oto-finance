"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { InvestmentTransactionCategory } from "@prisma/client";
import {
  updateAccountsBalances,
  updateSingleAccountBalance,
} from "../../accounts/update-balance";
import { getAccounts } from "@/app/_data/get-accounts";
import { revalidatePath } from "next/cache";

export const recalculateBalances = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Retrieves all user transactions
  const transactions = await db.transaction.findMany({
    where: { userId },
  });

  // Retrieves all paid invoices
  const paidInvoices = await db.invoice.findMany({
    where: {
      userId,
      status: "PAID",
      paidByAccountId: { not: null },
    },
  });

  // Retrieves all user accounts
  const accounts = await getAccounts();

  // Group all operations in a single transaction to ensure atomicity
  await db.$transaction(
    async (prismaClient) => {
      // Resets all user accounts to zero and add initial balance
      for (const account of accounts) {
        await updateSingleAccountBalance({
          operation: "decrement",
          amount: Number(account.balance),
          accountId: account.id,
          transaction: prismaClient,
        });

        await updateSingleAccountBalance({
          operation: "increment",
          amount: Number(account.initialBalance),
          accountId: account.id,
          transaction: prismaClient,
        });
      }

      // Remove the amountPaid of paid invoices from the accounts balances
      for (const invoice of paidInvoices) {
        if (invoice.paidByAccountId && invoice.paymentAmount) {
          await updateSingleAccountBalance({
            operation: "decrement",
            amount: Number(invoice.paymentAmount),
            accountId: invoice.paidByAccountId,
            transaction: prismaClient,
          });
        }
      }

      // Groups transactions by account and recalculates the balance
      for (const transaction of transactions) {
        switch (transaction.type) {
          // Subtracts the value from the account
          case "EXPENSE":
            if (transaction.accountId) {
              await updateSingleAccountBalance({
                operation: "decrement",
                amount: Number(transaction.amount),
                accountId: transaction.accountId,
                transaction: prismaClient,
              });
            }
            break;

          // Adds the value to the account
          case "GAIN":
            if (transaction.accountId) {
              await updateSingleAccountBalance({
                operation: "increment",
                amount: Number(transaction.amount),
                accountId: transaction.accountId,
                transaction: prismaClient,
              });
            }
            break;

          // Transfers the value between accounts
          case "TRANSFER":
            if (transaction.fromAccountId && transaction.toAccountId) {
              await updateAccountsBalances({
                amount: Number(transaction.amount),
                fromAccountId: transaction.fromAccountId,
                toAccountId: transaction.toAccountId,
                transaction: prismaClient,
              });
            }
            break;

          // Subtracts or adds the value to the accounts
          case "INVESTMENT":
            if (transaction.accountId) {
              if (
                transaction.investmentCategory ===
                InvestmentTransactionCategory.INVESTMENT_NEGATIVE_RETURN
              ) {
                await updateSingleAccountBalance({
                  operation: "decrement",
                  amount: Number(transaction.amount),
                  accountId: transaction.accountId,
                  transaction: prismaClient,
                });
              } else if (
                transaction.investmentCategory ===
                InvestmentTransactionCategory.INVESTMENT_POSITIVE_RETURN
              ) {
                await updateSingleAccountBalance({
                  operation: "increment",
                  amount: Number(transaction.amount),
                  accountId: transaction.accountId,
                  transaction: prismaClient,
                });
              }
            }
            break;

          default:
            break;
        }
      }
    },
    { timeout: 60000 },
  );

  revalidatePath("/accounts");
};
