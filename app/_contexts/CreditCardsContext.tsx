"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CreditCard } from "@prisma/client";

type CreditCardsContextValue = {
  creditCards: CreditCard[];
  loading: boolean;
  error: string | null;
  reloadCreditCards: () => Promise<void>;
};

const CreditCardsContext = createContext<CreditCardsContextValue | undefined>(
  undefined,
);

export const CreditCardsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCreditCards = async () => {
    try {
      const res = await fetch("/api/credit-cards");
      if (!res.ok) throw new Error("Failed to fetch credit cards");
      const data = await res.json();
      setCreditCards(data);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreditCards();
  }, []);

  const reloadCreditCards = async () => {
    setLoading(true);
    await fetchCreditCards();
  };

  return (
    <CreditCardsContext.Provider
      value={{ creditCards, loading, error, reloadCreditCards }}
    >
      {children}
    </CreditCardsContext.Provider>
  );
};

export const useCreditCards = () => {
  const context = useContext(CreditCardsContext);
  if (!context) {
    throw new Error(
      "useCreditCards must be used within an CreditCardsProvider",
    );
  }
  return context;
};
