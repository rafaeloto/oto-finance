"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Account } from "@prisma/client";

type AccountsContextValue = {
  accounts: Account[];
  loading: boolean;
  error: string | null;
  getAccounts: () => Promise<Account[]>;
  reloadAccounts: () => Promise<void>;
};

const AccountsContext = createContext<AccountsContextValue | undefined>(
  undefined,
);

export const AccountsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<Account[] | null>(null);
  const fetchInProgressRef = useRef(false);

  const fetchAccounts = useCallback(async () => {
    // If already in cache, return immediately
    if (!!cacheRef.current && cacheRef.current.length > 0) {
      return cacheRef.current;
    }

    // If already fetching, don't start a new request
    if (fetchInProgressRef.current) {
      return;
    }

    try {
      fetchInProgressRef.current = true;
      setLoading(true);
      setError(null);

      const res = await fetch("/api/accounts");
      if (!res.ok) throw new Error("Failed to fetch accounts");

      const data = await res.json();

      // Update cache and state
      cacheRef.current = data;
      setAccounts(data);

      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
      fetchInProgressRef.current = false;
    }
  }, []);

  const getAccounts = useCallback(async () => {
    // Return from cache if available
    if (!!cacheRef.current && cacheRef.current.length > 0) {
      return cacheRef.current;
    }
    // Otherwise, fetch from server
    return fetchAccounts();
  }, [fetchAccounts]);

  const reloadAccounts = useCallback(async () => {
    // Clear cache for this type to force refetch
    cacheRef.current = [];
    await fetchAccounts();
  }, [fetchAccounts]);

  const value = useMemo(
    () => ({
      accounts,
      loading,
      error,
      getAccounts,
      reloadAccounts,
    }),
    [accounts, loading, error, getAccounts, reloadAccounts],
  );

  return (
    <AccountsContext.Provider value={value}>
      {children}
    </AccountsContext.Provider>
  );
};

export const useAccountsContext = () => {
  const context = useContext(AccountsContext);
  if (!context) {
    throw new Error("useAccounts must be used within an AccountsProvider");
  }
  return context;
};

export const useAccounts = () => {
  const {
    getAccounts,
    accounts: contextAccounts,
    loading,
    error,
    reloadAccounts,
  } = useAccountsContext();
  const [isLoading, setIsLoading] = useState(!contextAccounts?.length);

  const localAccounts = contextAccounts || [];

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        if (!localAccounts?.length) {
          setIsLoading(true);
          await getAccounts();
        }
      } catch (error) {
        console.error("Error loading accounts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAccounts();
  }, [getAccounts, localAccounts.length]);

  const reload = useCallback(async () => {
    await reloadAccounts();
    await getAccounts();
  }, [reloadAccounts, getAccounts]);

  return {
    accounts: localAccounts,
    loading: isLoading || loading,
    error,
    reload,
  };
};
