"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Category, TransactionType } from "@prisma/client";

type CategoryMap = Record<TransactionType, Category[]>;
type LoadingMap = Record<TransactionType, boolean>;
type ErrorMap = Record<TransactionType, string | null>;

type CategoriesContextValue = {
  categories: CategoryMap;
  loading: LoadingMap;
  error: ErrorMap;
  reloadCategories: (type?: TransactionType) => Promise<void>;
};

const CategoriesContext = createContext<CategoriesContextValue | undefined>(
  undefined,
);

const transactionTypes: TransactionType[] = [
  "GAIN",
  "EXPENSE",
  "TRANSFER",
  "INVESTMENT",
];

export const CategoriesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [categories, setCategories] = useState<CategoryMap>({
    GAIN: [],
    EXPENSE: [],
    TRANSFER: [],
    INVESTMENT: [],
  });

  const [loading, setLoading] = useState<LoadingMap>({
    GAIN: true,
    EXPENSE: true,
    TRANSFER: true,
    INVESTMENT: true,
  });

  const [error, setError] = useState<ErrorMap>({
    GAIN: null,
    EXPENSE: null,
    TRANSFER: null,
    INVESTMENT: null,
  });

  const fetchCategories = useCallback(async (type: TransactionType) => {
    setLoading((prev) => ({ ...prev, [type]: true }));
    setError((prev) => ({ ...prev, [type]: null }));

    try {
      const res = await fetch(`/api/categories?type=${type}`);
      if (!res.ok) throw new Error(`Failed to fetch ${type} categories`);

      const data = await res.json();
      setCategories((prev) => ({ ...prev, [type]: data }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      setError((prev) => ({ ...prev, [type]: err.message }));
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  }, []);

  const reloadCategories = useCallback(
    async (type?: TransactionType) => {
      if (type) {
        await fetchCategories(type);
      } else {
        await Promise.all(transactionTypes.map(fetchCategories));
      }
    },
    [fetchCategories],
  );

  useEffect(() => {
    reloadCategories();
  }, [reloadCategories]);

  return (
    <CategoriesContext.Provider
      value={{ categories, loading, error, reloadCategories }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategoriesContext = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error("useCategories must be used within a CategoriesProvider");
  }
  return context;
};

// Individual hooks
export const useGainCategories = () => {
  const { categories, loading, error, reloadCategories } =
    useCategoriesContext();
  return {
    categories: categories.GAIN,
    loading: loading.GAIN,
    error: error.GAIN,
    reload: () => reloadCategories(TransactionType.GAIN),
  };
};

export const useExpenseCategories = () => {
  const { categories, loading, error, reloadCategories } =
    useCategoriesContext();
  return {
    categories: categories.EXPENSE,
    loading: loading.EXPENSE,
    error: error.EXPENSE,
    reload: () => reloadCategories(TransactionType.EXPENSE),
  };
};

export const useTransferCategories = () => {
  const { categories, loading, error, reloadCategories } =
    useCategoriesContext();
  return {
    categories: categories.TRANSFER,
    loading: loading.TRANSFER,
    error: error.TRANSFER,
    reload: () => reloadCategories(TransactionType.TRANSFER),
  };
};

export const useInvestmentCategories = () => {
  const { categories, loading, error, reloadCategories } =
    useCategoriesContext();
  return {
    categories: categories.INVESTMENT,
    loading: loading.INVESTMENT,
    error: error.INVESTMENT,
    reload: () => reloadCategories(TransactionType.INVESTMENT),
  };
};
