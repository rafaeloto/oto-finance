import { db } from "@/app/_lib/prisma";

interface UpdateAccountBalanceParams {
  amount: number;
  accountId: string;
  operation: "increment" | "decrement";
}

// Função genérica para atualizar saldo de uma única conta
const updateSingleAccountBalance = async (
  params: UpdateAccountBalanceParams,
) => {
  await db.account.update({
    where: {
      id: params.accountId,
    },
    data: {
      balance: {
        [params.operation]: params.amount,
      },
    },
  });
};

// Action to update the balance of a single account
export const updateAccountBalance = async (
  params: UpdateAccountBalanceParams,
) => {
  const { amount, accountId, operation } = params;

  await updateSingleAccountBalance({ accountId, amount, operation });
};

interface UpdateAccountsBalancesParams {
  amount: number;
  fromAccountId: string;
  toAccountId: string;
}

// Action to update the balance of both accounts in a transfer
export const updateAccountsBalances = async (
  params: UpdateAccountsBalancesParams,
) => {
  const { amount, fromAccountId, toAccountId } = params;

  await Promise.all([
    updateSingleAccountBalance({
      accountId: fromAccountId,
      amount,
      operation: "decrement",
    }),
    updateSingleAccountBalance({
      accountId: toAccountId,
      amount,
      operation: "increment",
    }),
  ]);
};
