"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { CreditCardFlag } from "@prisma/client";
import { createCreditCardSchema } from "./schema";
import { revalidatePath } from "next/cache";

interface CreateCreditCardParams {
  name: string;
  limit: number;
  closingDate: number;
  dueDate: number;
  flag: CreditCardFlag;
  color: string;
}

export const createCreditCard = async (params: CreateCreditCardParams) => {
  createCreditCardSchema.parse(params);

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Transaction to create the credit card.
  await db.creditCard.create({
    data: {
      ...params,
      userId,
    },
  });

  revalidatePath("/credit-cards");
  revalidatePath("/credit-cards/details", "page");
};
