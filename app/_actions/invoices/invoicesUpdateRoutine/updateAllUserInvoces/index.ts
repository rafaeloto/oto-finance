"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { updateCardInvoices } from "@actions/invoices/invoicesUpdateRoutine/updateCardInvoices";
import { revalidatePath } from "next/cache";

export const updateAllUserInvoices = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Find all user credit cards
  const userCreditCards = await db.creditCard.findMany({
    where: { userId },
    select: {
      invoices: {
        where: { status: "OPEN" },
        select: {
          id: true,
          month: true,
          year: true,
          closingDate: true,
          dueDate: true,
        },
      },
    },
  });

  // Group all operations in a single transaction to ensure atomicity
  await db.$transaction(
    async (prismaClient) => {
      // Iterate through all user credit cards and ensure their invoices are up to date
      for (const card of userCreditCards) {
        await updateCardInvoices({
          openInvoices: card.invoices,
          client: prismaClient,
        });
      }
    },
    { timeout: 60000 },
  );

  revalidatePath("/credit-cards/details", "page");
};
