"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {
  TransactionType,
  GainTransactionCategory,
  ExpenseTransactionCategory,
  InvestmentTransactionCategory,
  TransferTransactionCategory,
  TransactionPaymentMethod,
} from "@prisma/client";
import { upsertTransactionSchema } from "./schema";
import { revalidatePath } from "next/cache";

interface UpsertTransactionParams {
  id?: string;
  name: string;
  amount: number;
  type: TransactionType;
  category: string;
  paymentMethod: TransactionPaymentMethod;
  date: Date;
}

export const upsertTransaction = async (params: UpsertTransactionParams) => {
  upsertTransactionSchema.parse(params);

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Mapear o campo `category` para o campo específico baseado no tipo de transação
  let categoryField;
  switch (params.type) {
    case TransactionType.GAIN:
      categoryField = {
        gainCategory: params.category as GainTransactionCategory,
      };
      break;
    case TransactionType.EXPENSE:
      categoryField = {
        expenseCategory: params.category as ExpenseTransactionCategory,
      };
      break;
    case TransactionType.INVESTMENT:
      categoryField = {
        investmentCategory: params.category as InvestmentTransactionCategory,
      };
      break;
    case TransactionType.TRANSFER:
      categoryField = {
        transferCategory: params.category as TransferTransactionCategory,
      };
      break;
    default:
      throw new Error("Tipo de transação inválido.");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { category, ...restParams } = params;

  await db.transaction.upsert({
    update: { ...restParams, userId, ...categoryField },
    create: { ...restParams, userId, ...categoryField },
    where: {
      id: params?.id ?? "",
    },
  });

  revalidatePath("/transactions");
  revalidatePath("/");
};
