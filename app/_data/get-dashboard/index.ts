import { db } from "@/app/_lib/prisma";
import { ExpenseTransactionCategory, TransactionType } from "@prisma/client";
import { TotalExpensePerCategory, TransactionPercentagePerType } from "./types";
import { auth } from "@clerk/nextjs/server";

export const getDashboard = async (month: string) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const where = {
    userId,
    date: {
      gte: new Date(`2024-${month}-01`),
      lte: new Date(`2024-${month}-31`),
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

  const investmentsTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: "INVESTMENT" },
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

  const balance = gainsTotal - investmentsTotal - expensesTotal;

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
      ? Math.round((investmentsTotal / transactionsTotal) * 100)
      : 0,
  };

  const totalExpensePerCategory: TotalExpensePerCategory[] = (
    await db.transaction.groupBy({
      by: ["expenseCategory"],
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
      category: category.expenseCategory as ExpenseTransactionCategory,
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
    investmentsTotal,
    expensesTotal,
    balance,
    typesPercentage,
    totalExpensePerCategory,
    lastTransactions: JSON.parse(JSON.stringify(lastTransactions)),
  };
};
