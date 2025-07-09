import { Category, Prisma } from "@prisma/client";
import type { TransactionPerCategory } from "@data/getCategorizedAmounts/types";
import type { TransactionsPerParentCategory } from "./types";
import { db } from "@/app/_lib/prisma";

type GetSubCategorizedAmountsParams = {
  parentCategories: TransactionPerCategory[];
  allCategories: Category[];
  whereClause: Prisma.TransactionWhereInput;
};

export const getSubCategorizedAmounts = async ({
  parentCategories,
  allCategories,
  whereClause,
}: GetSubCategorizedAmountsParams): Promise<
  TransactionsPerParentCategory[]
> => {
  const results: TransactionsPerParentCategory[] = [];

  // Iterates over each parent category
  for (const parentCategory of parentCategories) {
    // Finds the direct subcategories
    const subcategories = allCategories.filter(
      (cat) => cat.parentId === parentCategory.id,
    );

    // The categories to find are the parent category and it's subcategories
    const categoriesToFind = [...subcategories, parentCategory];

    const categoriesData = await Promise.all(
      categoriesToFind.map(async (category) => {
        const result = await db.transaction.aggregate({
          where: {
            ...whereClause,
            categoryId: category.id,
          },
          _sum: { amount: true },
        });

        const total = Number(result._sum.amount || 0);

        return {
          id: category.id,
          name:
            category.id === parentCategory.id
              ? "Sem Subcategoria"
              : category.name,
          icon: category.icon ?? "",
          color: category.color ?? "",
          totalAmount: total,
          percentageOfTotal:
            parentCategory.totalAmount > 0
              ? Math.round((total / parentCategory.totalAmount) * 100)
              : 0,
        };
      }),
    );

    // Filters out categories with zero amounts
    const validCategories = categoriesData.filter(
      (item) => item.totalAmount > 0,
    );

    // If there are valid categories, add to the result
    if (validCategories.length > 0) {
      results.push({
        parentCategoryId: parentCategory.id,
        categories: validCategories.sort(
          (a, b) => b.totalAmount - a.totalAmount,
        ),
      });
    }
  }

  return results;
};
