import { db } from "@/app/_lib/prisma";
import { TransactionType } from "@prisma/client";
import { getMonthDateRange } from "@utils/date";
import { auth } from "@clerk/nextjs/server";
import { getTotalBalance } from "@data/getTotalBalance";
import { getCategories } from "@data/getCategories";
import {
  GAIN_MAP,
  EXPENSE_MAP,
  INVESTMENT_DEPOSIT_ID,
  INVESTMENT_WITHDRAW_ID,
  NEGATIVE_RETURN_ID,
  POSITIVE_RETURN_ID,
} from "@constants/category";
import { getCategorizedAmounts } from "./getCategorizedAmounts";

export const getDashboard = async (
  month: string,
  year: string,
  ignoreLoans?: string,
) => {
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
    ...(ignoreLoans === "true" && {
      NOT: [{ categoryId: GAIN_MAP.LOAN }, { categoryId: EXPENSE_MAP.LOAN }],
    }),
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

  const categories = await getCategories({});

  const expensesPerCategory = await getCategorizedAmounts({
    transactionType: TransactionType.EXPENSE,
    categories,
    whereClause: where,
    totalAmount: expensesTotal,
  });

  const gainsPerCategory = await getCategorizedAmounts({
    transactionType: TransactionType.GAIN,
    categories,
    whereClause: where,
    totalAmount: gainsTotal,
  });

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
    expensesPerCategory,
    gainsPerCategory,
    lastTransactions: JSON.parse(JSON.stringify(lastTransactions)),
  };
};
