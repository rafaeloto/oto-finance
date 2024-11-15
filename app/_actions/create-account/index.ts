"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Bank } from "@prisma/client";
import { createAccountSchema } from "./schema";
import { revalidatePath } from "next/cache";

interface CreateAccountParams {
  name: string;
  bank: Bank;
  balance?: number;
}

export const createAccount = async (params: CreateAccountParams) => {
  createAccountSchema.parse(params);

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const balance = params.balance ?? 0;

  await db.account.create({
    data: {
      name: params.name,
      bank: params.bank,
      balance,
      userId,
    },
  });

  revalidatePath("/accounts");
};
