"use server";

import { db } from "@/app/_lib/prisma";
import { getImportantDates } from "@/app/_utils/date";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";

type UpdateCardInvoicesProps = {
  creditCardId: string;
  client?: Omit<Prisma.TransactionClient, "$transaction">;
};

export const updateCardInvoices = async (props: UpdateCardInvoicesProps) => {
  const { creditCardId, client } = props;

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

  // Close all open invoices that should be closed
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
};
