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
import getTransaction from "@/app/_data/get-transaction";

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

  const existingTransaction = await getTransaction(params.id);

  await db.transaction.upsert({
    update: { ...params, userId, type: "EXPENSE" },
    create: { ...params, userId, type: "EXPENSE" },
    where: {
      id: params?.id ?? "",
    },
  });

  if (existingTransaction) {
    const difference = params.amount - Number(existingTransaction.amount);
    await updateAccountBalance({
      operation: difference > 0 ? "decrement" : "increment",
      amount: Math.abs(difference),
      accountId: params.accountId,
    });
  } else {
    await updateAccountBalance({
      operation: "decrement",
      amount: params.amount,
      accountId: params.accountId,
    });
  }

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
    await updateAccountBalance({
      operation: difference > 0 ? "increment" : "decrement",
      amount: Math.abs(difference),
      accountId: params.accountId,
    });
  } else {
    await updateAccountBalance({
      operation: "increment",
      amount: params.amount,
      accountId: params.accountId,
    });
  }

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

    await Promise.all([
      updateAccountBalance({
        operation: difference > 0 ? "decrement" : "increment",
        amount: Math.abs(difference),
        accountId: params.fromAccountId,
      }),
      updateAccountBalance({
        operation: difference > 0 ? "increment" : "decrement",
        amount: Math.abs(difference),
        accountId: params.toAccountId,
      }),
    ]);
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

  const existingTransaction = await getTransaction(params.id);

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

  if (existingTransaction) {
    const difference = params.amount - Number(existingTransaction.amount);

    await updateAccountBalance({
      operation:
        difference > 0
          ? operation
          : operation === "increment"
            ? "decrement"
            : "increment",
      amount: Math.abs(difference),
      accountId: params.accountId,
    });
  } else {
    await updateAccountBalance({
      operation,
      amount: params.amount,
      accountId: params.accountId,
    });
  }

  revalidatePath("/");
  revalidatePath("/transactions");
  revalidatePath("/accounts");
};
