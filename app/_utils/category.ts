import { useCategoriesContext } from "@contexts/CategoriesContext";
import { useMemo } from "react";

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
    reload: () => reloadCategories(),
  };
};
