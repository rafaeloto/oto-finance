import { useCategoriesContext } from "@contexts/CategoriesContext";
import { TransactionType } from "@prisma/client";
import { useMemo } from "react";
import { EXPENSE_MAP, GAIN_MAP } from "@constants/category";

export const useAllCategories = () => {
  const { categories, loading, error, reloadCategories } =
    useCategoriesContext();

  const allCategories = useMemo(
    () => [
      ...categories.GAIN,
      ...categories.EXPENSE,
      ...categories.TRANSFER,
      ...categories.INVESTMENT,
    ],
    [categories],
  );

  const isLoading = useMemo(
    () =>
      loading.GAIN || loading.EXPENSE || loading.TRANSFER || loading.INVESTMENT,
    [loading],
  );

  const hasError = useMemo(
    () => error.GAIN || error.EXPENSE || error.TRANSFER || error.INVESTMENT,
    [error],
  );

  return {
    categories: allCategories,
    loading: isLoading,
    error: hasError,
    reload: (type?: TransactionType) => reloadCategories(type),
  };
};

/**
 * Checks if a given category is a loan category (either expense or gain type).
 *
 * @param {string} categoryId - The category id to check
 * @returns {boolean} True if the category is a loan, false otherwise
 */
export const isLoanCategory = (categoryId: string | undefined): boolean => {
  if (!categoryId) return false;
  return categoryId === EXPENSE_MAP.LOAN || categoryId === GAIN_MAP.LOAN;
};
