"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

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

  // Close all open invoices that should be closed
  await db.invoice.updateMany({
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

  revalidatePath("/credit-cards");
  revalidatePath("/credit-cards/details");
};
