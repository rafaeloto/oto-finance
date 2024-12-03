"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Account } from "@prisma/client";

type AccountsContextValue = {
  accounts: Account[];
  loading: boolean;
  error: string | null;
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

  const fetchAccounts = async () => {
    try {
      const res = await fetch("/api/accounts");
      if (!res.ok) throw new Error("Failed to fetch accounts");

      const data = await res.json();
      setAccounts(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const reloadAccounts = async () => {
    setLoading(true);
    await fetchAccounts();
  };

  return (
    <AccountsContext.Provider
      value={{ accounts, loading, error, reloadAccounts }}
    >
      {children}
    </AccountsContext.Provider>
  );
};

export const useAccounts = () => {
  const context = useContext(AccountsContext);
  if (!context) {
    throw new Error("useAccounts must be used within an AccountsProvider");
  }
  return context;
};
