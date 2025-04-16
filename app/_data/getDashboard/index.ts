import { db } from "@/app/_lib/prisma";
import { ExpenseTransactionCategory, TransactionType } from "@prisma/client";
import { TotalExpensePerCategory, TransactionPercentagePerType } from "./types";
import { getMonthDateRange } from "@utils/date";
import { auth } from "@clerk/nextjs/server";
import { getTotalBalance } from "@data/getTotalBalance";

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
        investmentCategory: "INVESTMENT_POSITIVE_RETURN",
      },
      _sum: { amount: true },
    }),
    db.transaction.aggregate({
      where: {
        ...where,
        type: "INVESTMENT",
        investmentCategory: "INVESTMENT_NEGATIVE_RETURN",
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
        transferCategory: "INVESTMENT_DEPOSIT",
      },
      _sum: { amount: true },
    }),
    db.transaction.aggregate({
      where: {
        ...where,
        type: "TRANSFER",
        transferCategory: "INVESTMENT_WITHDRAW",
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
