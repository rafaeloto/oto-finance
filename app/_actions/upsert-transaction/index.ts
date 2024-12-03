"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {
  // TransactionType,
  // GainTransactionCategory,
  ExpenseTransactionCategory,
  // InvestmentTransactionCategory,
  // TransferTransactionCategory,
  TransactionPaymentMethod,
} from "@prisma/client";
import { upsertExpenseTransactionSchema } from "./schema";
import { revalidatePath } from "next/cache";

interface UpsertTransactionParams {
  id?: string;
  name: string;
  amount: number;
  expenseCategory: ExpenseTransactionCategory;
  paymentMethod: TransactionPaymentMethod;
  date: Date;
}

export const upsertExpenseTransaction = async (
  params: UpsertTransactionParams,
) => {
  upsertExpenseTransactionSchema.parse(params);

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  await db.transaction.upsert({
    update: { ...params, userId, type: "EXPENSE" },
    create: { ...params, userId, type: "EXPENSE" },
    where: {
      id: params?.id ?? "",
    },
  });

  revalidatePath("/transactions");
  revalidatePath("/");
};
