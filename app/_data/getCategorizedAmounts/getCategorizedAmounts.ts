import { Category, Prisma, TransactionType } from "@prisma/client";
import { TransactionPerCategory } from "./types";
import { db } from "@/app/_lib/prisma";

type GetCategorizedAmountsParams = {
  transactionType: TransactionType;
  categories: Category[];
  whereClause: Prisma.TransactionWhereInput;
  totalAmount: number;
};

export const getCategorizedAmounts = async ({
  transactionType,
  categories,
  whereClause,
  totalAmount,
}: GetCategorizedAmountsParams): Promise<TransactionPerCategory[]> => {
  // Filter parent categories by type
  const parentCategories = categories.filter(
    (cat) => !cat.parentId && cat.type === transactionType,
  );

  // Recursively get all category IDs
  const getCategoryIds = (categoryId: string): string[] => {
    const subcategories = categories.filter(
      (cat) => cat.parentId === categoryId,
    );
    return [categoryId, ...subcategories.map((cat) => cat.id)];
  };

  // Get the data for each parent category including it's subcategories
  const results: TransactionPerCategory[] = await Promise.all(
    parentCategories.map(async (parentCategory) => {
      const categoryIds = getCategoryIds(parentCategory.id);

      const result = await db.transaction.aggregate({
        where: {
          ...whereClause,
          type: transactionType,
          categoryId: { in: categoryIds },
        },
        _sum: {
          amount: true,
        },
      });

      const total = Number(result._sum.amount || 0);

      return {
        id: parentCategory.id,
        name: parentCategory.name,
        icon: parentCategory.icon ?? "",
        color: parentCategory.color ?? "",
        totalAmount: total,
        percentageOfTotal:
          totalAmount > 0 ? Math.round((total / Number(totalAmount)) * 100) : 0,
      };
    }),
  );

  // Filter out categories with zero amounts and sort by total amount in descending order
  return results
    .filter((item) => item.totalAmount > 0)
    .sort((a, b) => b.totalAmount - a.totalAmount);
};
