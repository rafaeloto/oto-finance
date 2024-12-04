"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { TransferTransactionCategory } from "@prisma/client";
import { upsertTransferTransactionSchema } from "./schema";
import { revalidatePath } from "next/cache";
import {
  updateSingleAccountBalance,
  updateAccountsBalances,
} from "../../accounts/update-balance";
import getTransaction from "@/app/_data/get-transaction";

interface UpsertTransferTransactionParams {
  id?: string;
  name: string;
  amount: number;
  transferCategory: TransferTransactionCategory;
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

  const existingTransaction = await getTransaction(params.id);

  await db.transaction.upsert({
    update: { ...params, userId, type: "TRANSFER", paymentMethod: "DEBIT" },
    create: { ...params, userId, type: "TRANSFER", paymentMethod: "DEBIT" },
    where: {
      id: params?.id ?? "",
    },
  });

  if (existingTransaction) {
    const difference = params.amount - Number(existingTransaction.amount);

    if (difference !== 0) {
      await Promise.all([
        updateSingleAccountBalance({
          operation: difference > 0 ? "decrement" : "increment",
          amount: Math.abs(difference),
          accountId: params.fromAccountId,
        }),
        updateSingleAccountBalance({
          operation: difference > 0 ? "increment" : "decrement",
          amount: Math.abs(difference),
          accountId: params.toAccountId,
        }),
      ]);
    }
  } else {
    await updateAccountsBalances({
      amount: params.amount,
      fromAccountId: params.fromAccountId,
      toAccountId: params.toAccountId,
    });
  }

  revalidatePath("/");
  revalidatePath("/transactions");
  revalidatePath("/accounts");
};
