"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {
  ExpenseTransactionCategory,
  GainTransactionCategory,
  TransferTransactionCategory,
  InvestmentTransactionCategory,
  TransactionPaymentMethod,
} from "@prisma/client";
import {
  upsertExpenseTransactionSchema,
  upsertGainTransactionSchema,
  upsertTransferTransactionSchema,
  upsertInvestmentTransactionSchema,
} from "./schema";
import { revalidatePath } from "next/cache";
import {
  updateAccountBalance,
  updateAccountsBalances,
} from "../update-balance";

interface UpsertExpenseTransactionParams {
  id?: string;
  name: string;
  amount: number;
  expenseCategory: ExpenseTransactionCategory;
  accountId: string;
  paymentMethod: TransactionPaymentMethod;
  date: Date;
}

export const upsertExpenseTransaction = async (
  params: UpsertExpenseTransactionParams,
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

  await updateAccountBalance({
    operation: "decrement",
    amount: params.amount,
    accountId: params.accountId,
  });

  revalidatePath("/");
  revalidatePath("/transactions");
  revalidatePath("/accounts");
};

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

  await db.transaction.upsert({
    update: { ...params, userId, type: "GAIN", paymentMethod: "DEBIT" },
    create: { ...params, userId, type: "GAIN", paymentMethod: "DEBIT" },
    where: {
      id: params?.id ?? "",
    },
  });

  await updateAccountBalance({
    operation: "increment",
    amount: params.amount,
    accountId: params.accountId,
  });

  revalidatePath("/");
  revalidatePath("/transactions");
  revalidatePath("/accounts");
};

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

  await db.transaction.upsert({
    update: { ...params, userId, type: "TRANSFER", paymentMethod: "DEBIT" },
    create: { ...params, userId, type: "TRANSFER", paymentMethod: "DEBIT" },
    where: {
      id: params?.id ?? "",
    },
  });

  await updateAccountsBalances({
    amount: params.amount,
    fromAccountId: params.fromAccountId,
    toAccountId: params.toAccountId,
  });

  revalidatePath("/");
  revalidatePath("/transactions");
  revalidatePath("/accounts");
};

interface UpsertInvestmentTransactionParams {
  id?: string;
  name: string;
  amount: number;
  investmentCategory: InvestmentTransactionCategory;
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

  await db.transaction.upsert({
    update: { ...params, userId, type: "INVESTMENT", paymentMethod: "DEBIT" },
    create: { ...params, userId, type: "INVESTMENT", paymentMethod: "DEBIT" },
    where: {
      id: params?.id ?? "",
    },
  });

  const operation =
    params.investmentCategory === "INVESTMENT_NEGATIVE_RETURN"
      ? "decrement"
      : "increment";

  await updateAccountBalance({
    operation,
    amount: params.amount,
    accountId: params.accountId,
  });

  revalidatePath("/");
  revalidatePath("/transactions");
  revalidatePath("/accounts");
};
