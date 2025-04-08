"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { createInvoiceSchema } from "./schema";
import { InvoiceStatus, Prisma } from "@prisma/client";

type CreateInvoiceParams = {
  creditCardId: string;
  month: number;
  year: number;
  status?: Omit<InvoiceStatus, "PAID">;
  transaction?: Omit<Prisma.TransactionClient, "$transaction">;
};

export const createInvoice = async (params: CreateInvoiceParams) => {
  const {
    creditCardId,
    month,
    year,
    status = "OPEN",
  } = createInvoiceSchema.parse(params);

  const { transaction } = params;

  // Uses the transactional client, if provided, or the default client.
  const prismaClient = transaction ?? db;

  // Checks if the credit card exists
  const creditCard = await prismaClient.creditCard.findUnique({
    where: { id: creditCardId },
    select: { closingDate: true, dueDate: true },
  });

  if (!creditCard) {
    throw new Error("Credit card not found");
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
    throw new Error("There is already an invoice for this month and year");
  }

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const invoice = await prismaClient.invoice.create({
    data: {
      creditCardId,
      month,
      year,
      closingDate: creditCard.closingDate,
      dueDate: creditCard.dueDate,
      userId,
      status,
      totalAmount: 0,
    },
  });

  return invoice;
};
