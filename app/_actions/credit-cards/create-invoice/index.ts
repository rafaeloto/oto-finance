"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { createInvoiceSchema } from "./schema";
import { Prisma } from "@prisma/client";

interface CreateInvoiceParams {
  creditCardId: string;
  month: number;
  year: number;
  transaction?: Omit<Prisma.TransactionClient, "$transaction">;
}

export const createInvoice = async (params: CreateInvoiceParams) => {
  const { creditCardId, month, year } = createInvoiceSchema.parse(params);

  const { transaction } = params;

  // Uses the transactional client, if provided, or the default client.
  const prismaClient = transaction ?? db;

  // Checks if the credit card exists
  const creditCard = await prismaClient.creditCard.findUnique({
    where: { id: creditCardId },
  });
  if (!creditCard) {
    throw new Error("Cartão de crédito não encontrado.");
  }

  // Checks if the invoice already exists for the given month/year and credit card.
  const existingInvoice = await prismaClient.invoice.findFirst({
    where: {
      creditCardId,
      month,
      year,
    },
  });
  if (existingInvoice) {
    throw new Error("Já existe uma fatura para este cartão neste mês e ano.");
  }

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  await prismaClient.invoice.create({
    data: {
      creditCardId,
      month,
      year,
      userId,
      status: "OPEN",
      totalAmount: 0,
    },
  });
};
