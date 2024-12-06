"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Invoice } from "@prisma/client";

type InvoicesContextValue = {
  invoices: Invoice[];
  loading: boolean;
  error: string | null;
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

  const fetchInvoices = async () => {
    try {
      const res = await fetch("/api/invoices");
      if (!res.ok) throw new Error("Failed to fetch invoices");
      const data = await res.json();
      setInvoices(data);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const reloadInvoices = async () => {
    setLoading(true);
    await fetchInvoices();
  };

  return (
    <InvoicesContext.Provider
      value={{ invoices, loading, error, reloadInvoices }}
    >
      {children}
    </InvoicesContext.Provider>
  );
};

export const useInvoices = () => {
  const context = useContext(InvoicesContext);
  if (!context) {
    throw new Error("useInvoices must be used within an InvoicesProvider");
  }
  return context;
};
