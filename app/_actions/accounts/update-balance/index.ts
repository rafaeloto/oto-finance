import { db } from "@/app/_lib/prisma";
import { Prisma } from "@prisma/client";

interface updateSingleAccountBalanceParams {
  amount: number;
  accountId: string;
  operation: "increment" | "decrement";
  transaction?: Omit<Prisma.TransactionClient, "$transaction">;
}

// Action to update the balance of a single account
export const updateSingleAccountBalance = async (
  params: updateSingleAccountBalanceParams,
) => {
  const { amount, accountId, operation, transaction } = params;

  const prismaClient = transaction || db;

  await prismaClient.account.update({
    where: { id: accountId },
    data: {
      balance: { [operation]: amount },
    },
  });
};

interface UpdateAccountsBalancesParams {
  amount: number;
  fromAccountId: string;
  toAccountId: string;
  transaction?: typeof db;
}

// Action to update the balance of both accounts in a transfer
export const updateAccountsBalances = async (
  params: UpdateAccountsBalancesParams,
) => {
  const { amount, fromAccountId, toAccountId, transaction } = params;

  await Promise.all([
    updateSingleAccountBalance({
      accountId: fromAccountId,
      amount,
      operation: "decrement",
      transaction,
    }),
    updateSingleAccountBalance({
      accountId: toAccountId,
      amount,
      operation: "increment",
      transaction,
    }),
  ]);
};
