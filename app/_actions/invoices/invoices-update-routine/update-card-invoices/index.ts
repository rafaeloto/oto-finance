"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { createInvoice } from "@/app/_actions/credit-cards/create-invoice";

export const updateCardInvoices = async (creditCardId: string) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const creditCard = await db.creditCard.findUnique({
    where: { id: creditCardId },
  });

  if (!creditCard) {
    throw new Error("Credit card not found");
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();
  const closingDay = creditCard.closingDate;

  const getShouldCloseInvoice = (invoice: { month: number; year: number }) => {
    if (
      invoice.year < currentYear ||
      (invoice.year === currentYear && invoice.month < currentMonth) ||
      (invoice.year === currentYear &&
        invoice.month === currentMonth &&
        currentDay > closingDay)
    ) {
      return true;
    }

    return false;
  };

  // Busca a última fatura existente do cartão
  const lastInvoice = await db.invoice.findFirst({
    where: { creditCardId },
    orderBy: [{ year: "desc" }, { month: "desc" }],
  });

  let lastMonth = lastInvoice?.month ?? currentMonth;
  let lastYear = lastInvoice?.year ?? currentYear;

  const missingInvoices: { month: number; year: number }[] = [];

  while (
    lastYear < currentYear ||
    (lastYear === currentYear && lastMonth < currentMonth)
  ) {
    lastMonth = lastMonth === 12 ? 1 : lastMonth + 1;

    if (lastMonth === 1) lastYear++;

    missingInvoices.push({ month: lastMonth, year: lastYear });
  }

  await db.$transaction(async (prismaClient) => {
    // Fecha todas as faturas pendentes que deveriam estar fechadas
    await prismaClient.invoice.updateMany({
      where: {
        creditCardId,
        status: "OPEN",
        OR: [
          { year: { lt: currentYear } },
          { year: currentYear, month: { lt: currentMonth } },
          {
            year: currentYear,
            month: currentMonth,
            closingDate: { lt: currentDay },
          },
        ],
      },
      data: { status: "CLOSED" },
    });

    // Cria todas as faturas ausentes
    for (const invoice of missingInvoices) {
      const shouldCloseInvoice = getShouldCloseInvoice(invoice);

      await createInvoice({
        creditCardId,
        month: invoice.month,
        year: invoice.year,
        transaction: prismaClient,
        status: shouldCloseInvoice ? "CLOSED" : "OPEN",
      });
    }
  });
};
