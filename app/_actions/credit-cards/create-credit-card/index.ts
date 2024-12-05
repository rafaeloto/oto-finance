"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { CreditCardFlag } from "@prisma/client";
import { createCreditCardSchema } from "./schema";
import { createInvoice } from "../create-invoice";
// import { revalidatePath } from "next/cache";

interface CreateCreditCardParams {
  name: string;
  limit: number;
  closingDate: number;
  dueDate: number;
  flag: CreditCardFlag;
}

export const createCreditCard = async (params: CreateCreditCardParams) => {
  createCreditCardSchema.parse(params);

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Gets the current month and year
  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  // Determines the month and year of the first invoice.
  let firstInvoiceMonth = currentMonth;
  let firstInvoiceYear = currentYear;

  if (currentDay > params.closingDate) {
    // If the closing date has already passed, the first invoice will be for the next month.
    firstInvoiceMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    firstInvoiceYear = currentMonth === 12 ? currentYear + 1 : currentYear;
  }

  // Determines the month and year of the second invoice.
  const secondInvoiceMonth =
    firstInvoiceMonth === 12 ? 1 : firstInvoiceMonth + 1;
  const secondInvoiceYear =
    firstInvoiceMonth === 12 ? firstInvoiceYear + 1 : firstInvoiceYear;

  // Transaction to create the credit card and the invoices.
  await db.$transaction(async (prismaClient) => {
    const newCreditCard = await prismaClient.creditCard.create({
      data: {
        ...params,
        userId,
      },
    });

    // Generates the invoice for the current month.
    await createInvoice({
      creditCardId: newCreditCard.id,
      month: firstInvoiceMonth,
      year: firstInvoiceYear,
      transaction: prismaClient,
    });

    await createInvoice({
      creditCardId: newCreditCard.id,
      month: secondInvoiceMonth,
      year: secondInvoiceYear,
      transaction: prismaClient,
    });
  });

  // revalidatePath("/credit-cards"); TODO: Uncomment when the page is ready.
};
