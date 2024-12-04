"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GainTransactionCategory } from "@prisma/client";
import { upsertGainTransactionSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { updateSingleAccountBalance } from "../../accounts/update-balance";
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

  const existingTransaction = await getTransaction(params.id);

  await db.transaction.upsert({
    update: { ...params, userId, type: "GAIN", paymentMethod: "DEBIT" },
    create: { ...params, userId, type: "GAIN", paymentMethod: "DEBIT" },
    where: {
      id: params?.id ?? "",
    },
  });

  if (existingTransaction) {
    const difference = params.amount - Number(existingTransaction.amount);

    if (difference !== 0) {
      await updateSingleAccountBalance({
        operation: difference > 0 ? "increment" : "decrement",
        amount: Math.abs(difference),
        accountId: params.accountId,
      });
    }
  } else {
    await updateSingleAccountBalance({
      operation: "increment",
      amount: params.amount,
      accountId: params.accountId,
    });
  }

  revalidatePath("/");
  revalidatePath("/transactions");
  revalidatePath("/accounts");
};
