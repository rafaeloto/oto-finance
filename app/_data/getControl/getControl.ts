import { db } from "@/app/_lib/prisma";
import { TransactionType } from "@prisma/client";
import { getMonthDateRange } from "@utils/date";
import { auth } from "@clerk/nextjs/server";
import { getCategories } from "@data/getCategories";
import { GAIN_MAP, EXPENSE_MAP } from "@constants/category";
import { getCategorizedAmounts } from "../getCategorizedAmounts";
import { getSubCategorizedAmounts } from "../getSubCategorizedAmounts";

export const getControl = async (
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

  const [gainsTotal, expensesTotal, categories, lastTransactions] =
    await Promise.all([
      // gainsTotal
      db.transaction
        .aggregate({
          where: { ...where, type: "GAIN" },
          _sum: { amount: true },
        })
        .then((result) => Number(result?._sum?.amount)),

      // expensesTotal
      db.transaction
        .aggregate({
          where: { ...where, type: "EXPENSE" },
          _sum: { amount: true },
        })
        .then((result) => Number(result?._sum?.amount)),

      // categories
      getCategories({}),

      // lastTransactions
      db.transaction.findMany({
        where,
        orderBy: { date: "desc" },
        take: 15,
      }),
    ]);

  const [expensesPerCategory, gainsPerCategory] = await Promise.all([
    // expensesPerCategory
    getCategorizedAmounts({
      transactionType: TransactionType.EXPENSE,
      categories,
      whereClause: where,
      totalAmount: expensesTotal,
    }),
    // gainsPerCategory
    getCategorizedAmounts({
      transactionType: TransactionType.GAIN,
      categories,
      whereClause: where,
      totalAmount: gainsTotal,
    }),
  ]);

  const [expensesPerSubCategory, gainsPerSubCategory] = await Promise.all([
    // expensesPerSubCategory
    getSubCategorizedAmounts({
      parentCategories: expensesPerCategory,
      allCategories: categories,
      whereClause: where,
    }),
    // gainsPerSubCategory
    getSubCategorizedAmounts({
      parentCategories: gainsPerCategory,
      allCategories: categories,
      whereClause: where,
    }),
  ]);

  const parentCategories = categories.filter(
    (category) => category.parentId === null,
  );

  const parentCategoryOptions = {
    expense: parentCategories.filter((parent) =>
      expensesPerCategory.some((category) => parent.id === category.id),
    ),
    gain: parentCategories.filter((parent) =>
      gainsPerCategory.some((category) => parent.id === category.id),
    ),
  };

  return {
    expensesPerCategory,
    gainsPerCategory,
    expensesPerSubCategory,
    gainsPerSubCategory,
    parentCategoryOptions,
    lastTransactions: JSON.parse(JSON.stringify(lastTransactions)),
  };
};
