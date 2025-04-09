import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { TransactionPaymentMethod, TransactionType } from "@prisma/client";
import { endOfMonth, startOfMonth } from "date-fns";

export type getTransactionsParams = {
  name?: string;
  type?: TransactionType;
  paymentMethod?: TransactionPaymentMethod;
  accountId?: string;
  cardId?: string;
  invoiceId?: string;
  month?: string;
  year?: string;
};

export const getTransactions = async (params: getTransactionsParams = {}) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const {
    name,
    type,
    paymentMethod,
    accountId,
    cardId,
    invoiceId,
    month,
    year,
  } = params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filters: any = {
    userId,
    ...(!!name && { name: { contains: name, mode: "insensitive" } }),
    ...(!!type && { type }),
    ...(!!paymentMethod && { paymentMethod }),
    ...(!!cardId && { cardId }),
    ...(!!invoiceId && { invoiceId }),
  };

  // Filter by month and year if provided
  if (month && year) {
    const parsedMonth = parseInt(month, 10) - 1; // `date-fns` uses zero-based index (January = 0)
    const parsedYear = parseInt(year, 10);

    const startDate = startOfMonth(new Date(parsedYear, parsedMonth));
    const endDate = endOfMonth(new Date(parsedYear, parsedMonth));

    filters.date = {
      gte: startDate,
      lte: endDate,
    };
  }

  // Filter that can be either one or other
  if (accountId) {
    filters.OR = [
      { accountId },
      { fromAccountId: accountId },
      { toAccountId: accountId },
    ];
  }

  return db.transaction.findMany({
    where: filters,
    orderBy: {
      date: "desc",
    },
  });
};
