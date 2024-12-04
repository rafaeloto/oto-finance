"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { InvestmentTransactionCategory } from "@prisma/client";
import { upsertInvestmentTransactionSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { updateSingleAccountBalance } from "../../accounts/update-balance";
import getTransaction from "@/app/_data/get-transaction";

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

    if (difference !== 0) {
      await updateSingleAccountBalance({
        operation:
          difference > 0
            ? operation
            : operation === "increment"
              ? "decrement"
              : "increment",
        amount: Math.abs(difference),
        accountId: params.accountId,
      });
    }
  } else {
    await updateSingleAccountBalance({
      operation,
      amount: params.amount,
      accountId: params.accountId,
    });
  }

  revalidatePath("/");
  revalidatePath("/transactions");
  revalidatePath("/accounts");
};
