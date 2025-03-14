import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { TransactionPaymentMethod, TransactionType } from "@prisma/client";

type getTransactionsParams = {
  name?: string;
  type?: TransactionType;
  paymentMethod?: TransactionPaymentMethod;
  accountId?: string;
  cardId?: string;
  invoiceId?: string;
};

export const getTransactions = async (params: getTransactionsParams) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const { name, type, paymentMethod, accountId, cardId, invoiceId } = params;

  if (!invoiceId) {
    throw new Error("Missing 'invoiceId'");
  }

  const filters = {
    userId,
    ...(!!name && { name }),
    ...(!!type && { type }),
    ...(!!paymentMethod && { paymentMethod }),
    ...(!!accountId && {
      accountId,
      fromAccountId: accountId,
      toAccountId: accountId,
    }),
    ...(!!cardId && { cardId }),
    ...(!!invoiceId && { invoiceId }),
  };

  return db.transaction.findMany({
    where: filters,
    orderBy: {
      date: "desc",
    },
  });
};
