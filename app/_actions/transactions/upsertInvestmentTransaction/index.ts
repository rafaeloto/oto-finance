"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { upsertInvestmentTransactionSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { updateSingleAccountBalance } from "@actions/accounts/updateBalance";
import getTransaction from "@data/getTransaction";
import { NEGATIVE_RETURN_ID } from "@constants/category";

interface UpsertInvestmentTransactionParams {
  id?: string;
  name: string;
  amount: number;
  categoryId: string;
  accountId: string;
  date: Date;
}

export const upsertInvestmentTransaction = async (
  params: UpsertInvestmentTransactionParams,
) => {
  upsertInvestmentTransactionSchema.parse(params);

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const existingTransaction = await getTransaction({ id: params.id });

  const fieldsAffectingBalanceChanged = existingTransaction
    ? Number(existingTransaction.amount) !== params.amount ||
      existingTransaction.accountId !== params.accountId ||
      existingTransaction.categoryId !== params.categoryId
    : false;

  // Groups all operations in a single transaction, to apply transactional processing.
  await db.$transaction(async (transaction) => {
    await transaction.transaction.upsert({
      update: { ...params, userId, type: "INVESTMENT", paymentMethod: "DEBIT" },
      create: { ...params, userId, type: "INVESTMENT", paymentMethod: "DEBIT" },
      where: { id: params?.id ?? "" },
    });

    if (existingTransaction?.accountId && fieldsAffectingBalanceChanged) {
      // Reverses the impact of the previous transaction on the account's balance
      const previousOperation =
        existingTransaction.categoryId === NEGATIVE_RETURN_ID
          ? "decrement"
          : "increment";

      await updateSingleAccountBalance({
        operation:
          previousOperation === "increment" ? "decrement" : "increment",
        amount: Number(existingTransaction.amount),
        accountId: existingTransaction.accountId,
        transaction,
      });

      // Applies the new transaction's impact on the balance
      const newOperation =
        params.categoryId === NEGATIVE_RETURN_ID ? "decrement" : "increment";

      await updateSingleAccountBalance({
        operation: newOperation,
        amount: params.amount,
        accountId: params.accountId,
        transaction,
      });
    } else if (!existingTransaction) {
      // Updates the balance of the account, if it's a new transaction.
      const operation =
        params.categoryId === NEGATIVE_RETURN_ID ? "decrement" : "increment";

      await updateSingleAccountBalance({
        operation,
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
