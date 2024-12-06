import { db } from "@/app/_lib/prisma";
import { Prisma } from "@prisma/client";

interface updateInvoiceAmountParams {
  amount: number;
  invoiceId: string;
  operation: "increment" | "decrement";
  transaction?: Omit<Prisma.TransactionClient, "$transaction">;
}

// Action to update the balance of a single account
export const updateInvoiceAmount = async (
  params: updateInvoiceAmountParams,
) => {
  const { amount, invoiceId, operation, transaction } = params;

  const prismaClient = transaction || db;

  await prismaClient.invoice.update({
    where: { id: invoiceId },
    data: {
      totalAmount: { [operation]: amount },
    },
  });
};
