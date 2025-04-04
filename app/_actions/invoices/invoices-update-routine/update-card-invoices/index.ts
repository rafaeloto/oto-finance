"use server";

import { db } from "@/app/_lib/prisma";
import { getImportantDates } from "@/app/_utils/date";
import { auth } from "@clerk/nextjs/server";
import { Invoice, Prisma } from "@prisma/client";

type InvoiceKeys = "id" | "month" | "year" | "closingDate" | "dueDate";

type UpdateCardInvoicesProps = {
  openInvoices: Pick<Invoice, InvoiceKeys>[];
  client?: Omit<Prisma.TransactionClient, "$transaction">;
};

export const updateCardInvoices = async ({
  openInvoices,
  client,
}: UpdateCardInvoicesProps) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const prismaClient = client ?? db;

  const {
    day: currentDay,
    month: currentMonth,
    year: currentYear,
  } = getImportantDates(new Date());

  const invoicesToClose = openInvoices.filter((invoice) => {
    const { closingDate, dueDate } = invoice;
    let { year, month } = invoice;

    // If closingDate > dueDate, it means the closing happens in the previous month
    if (closingDate > dueDate) {
      month -= 1;
      if (month === 0) {
        month = 12;
        year -= 1;
      }
    }

    // Verifies if the invoice should be closed
    return (
      // Invoice year is in the past
      year < currentYear ||
      // Invoice year is current and month is in the past
      (year === currentYear && month < currentMonth) ||
      // Invoice year and month are current and closing day is in the past
      (year === currentYear &&
        month === currentMonth &&
        closingDate < currentDay)
    );
  });

  const idsToClose = invoicesToClose.map((invoice) => invoice.id);

  if (idsToClose.length === 0) return;

  // Close all open invoices that should be closed
  await prismaClient.invoice.updateMany({
    where: {
      id: { in: idsToClose },
    },
    data: { status: "CLOSED" },
  });
};
