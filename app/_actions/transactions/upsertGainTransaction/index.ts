"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GainTransactionCategory } from "@prisma/client";
import { upsertGainTransactionSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { updateSingleAccountBalance } from "@actions/accounts/updateBalance";
import getTransaction from "@/app/_data/get-transaction";

interface UpsertGainTransactionParams {
  id?: string;
  name: string;
  amount: number;
  gainCategory: GainTransactionCategory;
  accountId: string;
  date: Date;
}

export const upsertGainTransaction = async (
  params: UpsertGainTransactionParams,
) => {
  upsertGainTransactionSchema.parse(params);

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const existingTransaction = await getTransaction({ id: params.id });

  // Group all operations in a single transaction, to apply transactional processing.
  await db.$transaction(async (transaction) => {
    await transaction.transaction.upsert({
      update: { ...params, userId, type: "GAIN", paymentMethod: "DEBIT" },
      create: { ...params, userId, type: "GAIN", paymentMethod: "DEBIT" },
      where: { id: params?.id ?? "" },
    });

    // If there is an existing transaction, we must correct the accounts amount.
    if (existingTransaction?.accountId) {
      const difference = params.amount - Number(existingTransaction.amount);

      // If the selected account has changed, we adjust the balance of the previous and new account.
      if (existingTransaction.accountId !== params.accountId) {
        // Revert the balance of the previous account
        await updateSingleAccountBalance({
          operation: "decrement",
          amount: Number(existingTransaction.amount),
          accountId: existingTransaction.accountId,
          transaction,
        });

        // Update the balance of the new account
        await updateSingleAccountBalance({
          operation: "increment",
          amount: params.amount,
          accountId: params.accountId,
          transaction,
        });
      } else if (difference !== 0) {
        // Update the only the balance of the account, if the ammount has changed.
        await updateSingleAccountBalance({
          operation: difference > 0 ? "increment" : "decrement",
          amount: Math.abs(difference),
          accountId: params.accountId,
          transaction,
        });
      }
    } else {
      // Update the balance of the account, if it's a new transaction.
      await updateSingleAccountBalance({
        operation: "increment",
        amount: params.amount,
        accountId: params.accountId,
        transaction,
      });
    }
  });

  revalidatePath("/");
  revalidatePath("/transactions");
  revalidatePath("/accounts");
};
