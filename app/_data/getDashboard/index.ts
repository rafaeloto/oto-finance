import { db } from "@/app/_lib/prisma";
import { TransactionType } from "@prisma/client";
import { TotalExpensePerCategory, TransactionPercentagePerType } from "./types";
import { getMonthDateRange } from "@utils/date";
import { auth } from "@clerk/nextjs/server";
import { getTotalBalance } from "@data/getTotalBalance";
import { getCategories } from "@data/getCategories";
import {
  INVESTMENT_DEPOSIT_ID,
  INVESTMENT_WITHDRAW_ID,
  NEGATIVE_RETURN_ID,
  POSITIVE_RETURN_ID,
} from "@constants/category";

export const getDashboard = async (month: string, year: string) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const { start, end } = getMonthDateRange(month, year);

  const where = {
    userId,
    date: {
      gte: start,
      lte: end,
    },
  };

  const gainsTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: "GAIN" },
        _sum: { amount: true },
      })
    )?._sum?.amount,
  );

  const expensesTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: "EXPENSE" },
        _sum: { amount: true },
      })
    )?._sum?.amount,
  );

  const [positiveReturn, negativeReturn] = await Promise.all([
    db.transaction.aggregate({
      where: {
        ...where,
        type: "INVESTMENT",
        categoryId: POSITIVE_RETURN_ID,
      },
      _sum: { amount: true },
    }),
    db.transaction.aggregate({
      where: {
        ...where,
        type: "INVESTMENT",
        categoryId: NEGATIVE_RETURN_ID,
      },
      _sum: { amount: true },
    }),
  ]);

  const investmentsResult =
    Number(positiveReturn?._sum?.amount || 0) -
    Number(negativeReturn?._sum?.amount || 0);

  const [deposit, withdraw] = await Promise.all([
    db.transaction.aggregate({
      where: {
        ...where,
        type: "TRANSFER",
        categoryId: INVESTMENT_DEPOSIT_ID,
      },
      _sum: { amount: true },
    }),
    db.transaction.aggregate({
      where: {
        ...where,
        type: "TRANSFER",
        categoryId: INVESTMENT_WITHDRAW_ID,
      },
      _sum: { amount: true },
    }),
  ]);

  const investmentsBalance =
    Number(deposit?._sum?.amount || 0) - Number(withdraw?._sum?.amount || 0);

  const investmentsEvolution = investmentsBalance + investmentsResult;

  const result = gainsTotal + investmentsResult - expensesTotal;

  const totalBalance = await getTotalBalance();

  const transactionsTotal = Number(
    (
      await db.transaction.aggregate({
        where,
        _sum: { amount: true },
      })
    )._sum?.amount,
  );

  const typesPercentage: TransactionPercentagePerType = {
    [TransactionType.GAIN]: transactionsTotal
      ? Math.round((gainsTotal / transactionsTotal) * 100)
      : 0,
    [TransactionType.EXPENSE]: transactionsTotal
      ? Math.round((expensesTotal / transactionsTotal) * 100)
      : 0,
    [TransactionType.INVESTMENT]: transactionsTotal
      ? Math.round((investmentsEvolution / transactionsTotal) * 100)
      : 0,
  };

  const categories = await getCategories({});

  const totalExpensePerCategory: TotalExpensePerCategory[] = (
    await db.transaction.groupBy({
      by: ["categoryId"],
      where: {
        ...where,
        type: TransactionType.EXPENSE,
      },
      _sum: {
        amount: true,
      },
    })
  )
    .map((category) => ({
      category:
        categories.find((c) => c.id === category.categoryId)?.name ??
        "Categoria desconhecida",
      totalAmount: Number(category._sum.amount),
      percentageOfTotal: Math.round(
        (Number(category._sum.amount) / Number(expensesTotal)) * 100,
      ),
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount);

  const lastTransactions = await db.transaction.findMany({
    where,
    orderBy: { date: "desc" },
    take: 15,
  });

  return {
    gainsTotal,
    expensesTotal,
    investmentsResult,
    investmentsEvolution,
    result,
    totalBalance,
    typesPercentage,
    totalExpensePerCategory,
    lastTransactions: JSON.parse(JSON.stringify(lastTransactions)),
  };
};
