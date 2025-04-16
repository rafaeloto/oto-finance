"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Bank } from "@prisma/client";
import { upsertAccountSchema } from "./schema";
import { revalidatePath } from "next/cache";
import getAccount from "@data/getAccount";

interface UpsertAccountParams {
  id?: string;
  name: string;
  bank: Bank;
  initialBalance: number;
}

export const upsertAccount = async (params: UpsertAccountParams) => {
  upsertAccountSchema.parse(params);

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Group all operations in a single transaction, to apply transactional processing.
  await db.$transaction(async (transaction) => {
    const existingAccount = await getAccount({
      id: params.id,
      client: transaction,
    });

    const existingAccountBalance = Number(existingAccount?.balance) ?? 0;
    const existingInitialBalance = Number(existingAccount?.initialBalance) ?? 0;
    const balance = !!existingAccount
      ? existingAccountBalance - existingInitialBalance + params.initialBalance
      : params.initialBalance;

    await transaction.account.upsert({
      update: { ...params, userId, balance },
      create: { ...params, userId, balance },
      where: { id: params?.id ?? "" },
    });
  });

  revalidatePath("/accounts");
};
