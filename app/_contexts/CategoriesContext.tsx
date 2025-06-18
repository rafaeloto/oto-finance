"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { Category, TransactionType } from "@prisma/client";

type CategoryMap = Record<TransactionType, Category[]>;
type LoadingMap = Record<TransactionType, boolean>;
type ErrorMap = Record<TransactionType, string | null>;

type CategoriesContextValue = {
  categories: CategoryMap;
  loading: LoadingMap;
  error: ErrorMap;
  getCategories: (type: TransactionType) => Promise<Category[]>;
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

const initialState = {
  categories: {
    GAIN: [],
    EXPENSE: [],
    TRANSFER: [],
    INVESTMENT: [],
  } as CategoryMap,
  loading: {
    GAIN: false,
    EXPENSE: false,
    TRANSFER: false,
    INVESTMENT: false,
  } as LoadingMap,
  error: {
    GAIN: null,
    EXPENSE: null,
    TRANSFER: null,
    INVESTMENT: null,
  } as ErrorMap,
};

export const CategoriesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState(initialState);
  const cacheRef = useRef<CategoryMap>({ ...initialState.categories });
  const fetchInProgressRef = useRef<Record<TransactionType, boolean>>({
    GAIN: false,
    EXPENSE: false,
    TRANSFER: false,
    INVESTMENT: false,
  });

  const fetchCategories = useCallback(async (type: TransactionType) => {
    // If already in cache, return immediately
    if (cacheRef.current[type]?.length > 0) {
      return cacheRef.current[type];
    }

    // If already fetching, don't start a new request
    if (fetchInProgressRef.current[type]) {
      return;
    }

    try {
      fetchInProgressRef.current[type] = true;

      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, [type]: true },
        error: { ...prev.error, [type]: null },
      }));

      const res = await fetch(`/api/categories?type=${type}`);
      if (!res.ok) throw new Error(`Failed to fetch ${type} categories`);

      const data = await res.json();

      // Update cache
      cacheRef.current = {
        ...cacheRef.current,
        [type]: data,
      };

      setState((prev) => ({
        ...prev,
        categories: {
          ...prev.categories,
          [type]: data,
        },
        loading: {
          ...prev.loading,
          [type]: false,
        },
      }));

      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      setState((prev) => ({
        ...prev,
        error: { ...prev.error, [type]: err.message },
        loading: { ...prev.loading, [type]: false },
      }));
      throw err;
    } finally {
      fetchInProgressRef.current[type] = false;
    }
  }, []);

  const getCategories = useCallback(
    async (type: TransactionType) => {
      // Return from cache if available
      if (cacheRef.current[type]?.length > 0) {
        return cacheRef.current[type];
      }

      // Otherwise, fetch from server
      return fetchCategories(type);
    },
    [fetchCategories],
  );

  const reloadCategories = useCallback(
    async (type?: TransactionType) => {
      if (type) {
        // Clear cache for this type to force refetch
        cacheRef.current[type] = [];
        await fetchCategories(type);
      } else {
        // Clear all caches
        transactionTypes.forEach((t) => {
          cacheRef.current[t] = [];
        });
        await Promise.all(transactionTypes.map(fetchCategories));
      }
    },
    [fetchCategories],
  );

  // Only fetch categories when explicitly requested
  const value = useMemo(
    () => ({
      categories: state.categories,
      loading: state.loading,
      error: state.error,
      getCategories,
      reloadCategories,
    }),
    [
      state.categories,
      state.loading,
      state.error,
      getCategories,
      reloadCategories,
    ],
  );

  return (
    <CategoriesContext.Provider value={value}>
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

export const useCategories = (type: TransactionType) => {
  const {
    getCategories,
    categories: contextCategories,
    loading,
    error,
    reloadCategories,
  } = useCategoriesContext();
  const [isLoading, setIsLoading] = useState(!contextCategories[type]?.length);

  const localCategories = contextCategories[type] || [];

  useEffect(() => {
    const loadCategories = async () => {
      try {
        if (!localCategories?.length) {
          setIsLoading(true);
          await getCategories(type);
        }
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, [type, getCategories, localCategories.length]);

  const reload = useCallback(async () => {
    await reloadCategories(type);
    await getCategories(type);
  }, [reloadCategories, getCategories, type]);

  return {
    categories: localCategories,
    loading: isLoading || loading[type],
    error: error[type],
    reload,
  };
};

export const useAllCategories = () => {
  const {
    getCategories,
    reloadCategories,
    categories: contextCategories,
  } = useCategoriesContext();
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAllCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Gets empty categories from context
        const categoriesToLoad = transactionTypes.filter(
          (type) => !contextCategories[type as TransactionType]?.length,
        );

        if (!categoriesToLoad.length) {
          // If all categories are loaded, uses categories from context
          const categories = transactionTypes.flatMap(
            (type) => contextCategories[type as TransactionType] || [],
          );
          setAllCategories(categories);
          return;
        }

        const loadedCategories = await Promise.all(
          categoriesToLoad.map((type) =>
            getCategories(type as TransactionType),
          ),
        );

        // Combines loaded categories with existing categories
        const allFetchedCategories = [
          ...Object.values(contextCategories).flat(),
          ...loadedCategories.flat(),
        ];
        setAllCategories(allFetchedCategories);
      } catch (err) {
        console.error("Error loading all categories:", err);
        setError("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    };

    loadAllCategories();
  }, [getCategories, contextCategories]);

  const reload = useCallback(async () => {
    try {
      setIsLoading(true);
      await reloadCategories();
      const [gain, expense, transfer, investment] = await Promise.all([
        getCategories("GAIN"),
        getCategories("EXPENSE"),
        getCategories("TRANSFER"),
        getCategories("INVESTMENT"),
      ]);

      setAllCategories([...gain, ...expense, ...transfer, ...investment]);
      setError(null);
    } catch (err) {
      console.error("Error reloading all categories:", err);
      setError("Failed to reload categories");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [getCategories, reloadCategories]);

  return {
    categories: allCategories,
    loading: isLoading,
    error,
    reload,
  };
};
