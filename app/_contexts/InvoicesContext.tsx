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
import { Invoice } from "@prisma/client";

type InvoicesContextValue = {
  invoices: Invoice[];
  loading: boolean;
  error: string | null;
  getInvoices: () => Promise<Invoice[]>;
  reloadInvoices: () => Promise<void>;
};

const InvoicesContext = createContext<InvoicesContextValue | undefined>(
  undefined,
);

export const InvoicesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<Invoice[] | null>(null);
  const fetchInProgressRef = useRef(false);

  const fetchInvoices = useCallback(async () => {
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

      const res = await fetch("/api/invoices");
      if (!res.ok) throw new Error("Failed to fetch invoices");

      const data = await res.json();

      // Update cache and state
      cacheRef.current = data;
      setInvoices(data);

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

  const getInvoices = useCallback(async () => {
    // Return from cache if available
    if (!!cacheRef.current && cacheRef.current.length > 0) {
      return cacheRef.current;
    }
    // Otherwise, fetch from server
    return fetchInvoices();
  }, [fetchInvoices]);

  const reloadInvoices = useCallback(async () => {
    // Clear cache for this type to force refetch
    cacheRef.current = [];
    await fetchInvoices();
  }, [fetchInvoices]);

  const value = useMemo(
    () => ({
      invoices,
      loading,
      error,
      getInvoices,
      reloadInvoices,
    }),
    [invoices, loading, error, getInvoices, reloadInvoices],
  );

  return (
    <InvoicesContext.Provider value={value}>
      {children}
    </InvoicesContext.Provider>
  );
};

export const useInvoicesContext = () => {
  const context = useContext(InvoicesContext);
  if (!context) {
    throw new Error("useInvoices must be used within an InvoicesProvider");
  }
  return context;
};

export const useInvoices = () => {
  const {
    getInvoices,
    invoices: contextInvoices,
    loading,
    error,
    reloadInvoices,
  } = useInvoicesContext();
  const [isLoading, setIsLoading] = useState(!contextInvoices?.length);

  const localInvoices = contextInvoices || [];

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        if (!localInvoices?.length) {
          setIsLoading(true);
          await getInvoices();
        }
      } catch (error) {
        console.error("Error loading invoices:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInvoices();
  }, [getInvoices, localInvoices.length]);

  const reload = useCallback(async () => {
    await reloadInvoices();
    await getInvoices();
  }, [reloadInvoices, getInvoices]);

  return {
    invoices: localInvoices,
    loading: isLoading || loading,
    error,
    reload,
  };
};
