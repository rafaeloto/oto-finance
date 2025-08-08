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
import { CreditCard } from "@prisma/client";

type CreditCardsContextValue = {
  creditCards: CreditCard[];
  loading: boolean;
  error: string | null;
  getCreditCards: () => Promise<CreditCard[]>;
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
  const cacheRef = useRef<CreditCard[] | null>(null);
  const fetchInProgressRef = useRef(false);

  const fetchCreditCards = useCallback(async () => {
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

      const res = await fetch("/api/credit-cards");
      if (!res.ok) throw new Error("Failed to fetch credit cards");

      const data = await res.json();

      // Update cache and state
      cacheRef.current = data;
      setCreditCards(data);

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

  const getCreditCards = useCallback(async () => {
    // Return from cache if available
    if (!!cacheRef.current && cacheRef.current.length > 0) {
      return cacheRef.current;
    }
    // Otherwise, fetch from server
    return fetchCreditCards();
  }, [fetchCreditCards]);

  const reloadCreditCards = useCallback(async () => {
    // Clear cache for this type to force refetch
    cacheRef.current = [];
    await fetchCreditCards();
  }, [fetchCreditCards]);

  const value = useMemo(
    () => ({
      creditCards,
      loading,
      error,
      getCreditCards,
      reloadCreditCards,
    }),
    [creditCards, loading, error, getCreditCards, reloadCreditCards],
  );

  return (
    <CreditCardsContext.Provider value={value}>
      {children}
    </CreditCardsContext.Provider>
  );
};

export const useCreditCardsContext = () => {
  const context = useContext(CreditCardsContext);
  if (!context) {
    throw new Error(
      "useCreditCards must be used within an CreditCardsProvider",
    );
  }
  return context;
};

export const useCreditCards = () => {
  const {
    getCreditCards,
    creditCards: contextCreditCards,
    loading,
    error,
    reloadCreditCards,
  } = useCreditCardsContext();
  const [isLoading, setIsLoading] = useState(!contextCreditCards?.length);

  const localCreditCards = contextCreditCards || [];

  useEffect(() => {
    const loadCreditCards = async () => {
      try {
        if (!localCreditCards?.length) {
          setIsLoading(true);
          await getCreditCards();
        }
      } catch (error) {
        console.error("Error loading credit cards:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCreditCards();
  }, [getCreditCards, localCreditCards.length]);

  const reload = useCallback(async () => {
    await reloadCreditCards();
    await getCreditCards();
  }, [reloadCreditCards, getCreditCards]);

  return {
    creditCards: localCreditCards,
    loading: isLoading || loading,
    error,
    reload,
  };
};
