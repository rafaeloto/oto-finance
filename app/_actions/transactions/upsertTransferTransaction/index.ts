"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { upsertTransferTransactionSchema } from "./schema";
import { revalidatePath } from "next/cache";
import {
  updateSingleAccountBalance,
  updateAccountsBalances,
} from "@actions/accounts/updateBalance";
import getTransaction from "@data/getTransaction";

interface UpsertTransferTransactionParams {
  id?: string;
  name: string;
  amount: number;
  categoryId?: string;
  fromAccountId: string;
  toAccountId: string;
  date: Date;
}

export const upsertTransferTransaction = async (
  params: UpsertTransferTransactionParams,
) => {
  upsertTransferTransactionSchema.parse(params);

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const existingTransaction = await getTransaction({ id: params.id });

  // Identifies if there were changes that impact the balances.
  const fieldsAffectingBalanceChanged = existingTransaction
    ? Number(existingTransaction.amount) !== params.amount ||
      existingTransaction.fromAccountId !== params.fromAccountId ||
      existingTransaction.toAccountId !== params.toAccountId
    : false;

  // Groups all operations in a single transaction, to apply transactional processing.
  await db.$transaction(
    async (transaction) => {
      await transaction.transaction.upsert({
        update: { ...params, userId, type: "TRANSFER", paymentMethod: "DEBIT" },
        create: { ...params, userId, type: "TRANSFER", paymentMethod: "DEBIT" },
        where: { id: params?.id ?? "" },
      });

      if (
        existingTransaction?.fromAccountId &&
        existingTransaction?.toAccountId &&
        fieldsAffectingBalanceChanged
      ) {
        // Reverses the impact of the previous transaction on the balances
        await Promise.all([
          updateSingleAccountBalance({
            operation: "increment",
            amount: Number(existingTransaction.amount),
            accountId: existingTransaction.fromAccountId,
            transaction,
          }),
          updateSingleAccountBalance({
            operation: "decrement",
            amount: Number(existingTransaction.amount),
            accountId: existingTransaction.toAccountId,
            transaction,
          }),
        ]);

        // Applies the impact of the new transaction on the balances
        await Promise.all([
          updateSingleAccountBalance({
            operation: "decrement",
            amount: params.amount,
            accountId: params.fromAccountId,
            transaction,
          }),
          updateSingleAccountBalance({
            operation: "increment",
            amount: params.amount,
            accountId: params.toAccountId,
            transaction,
          }),
        ]);
      } else if (!existingTransaction) {
        // Updates the balance of the account, if it's a new transaction.
        await updateAccountsBalances({
          amount: params.amount,
          fromAccountId: params.fromAccountId,
          toAccountId: params.toAccountId,
          transaction,
        });
      }
    },
    { timeout: 60000 },
  );

  revalidatePath("/");
  revalidatePath("/transactions");
  revalidatePath("/accounts");
};
