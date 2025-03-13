"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Bank } from "@prisma/client";
import { createAccountSchema } from "./schema";
import { revalidatePath } from "next/cache";

interface CreateAccountParams {
  name: string;
  bank: Bank;
  initialBalance: number;
}

export const createAccount = async (params: CreateAccountParams) => {
  createAccountSchema.parse(params);

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const { name, bank, initialBalance } = params;

  await db.account.create({
    data: {
      name,
      bank,
      initialBalance,
      balance: initialBalance,
      userId,
    },
  });

  revalidatePath("/accounts");
};
