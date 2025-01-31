"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { updateCardInvoices } from "../update-card-invoices";

export const updateAllUserInvoices = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Busca todos os cartões de crédito do usuário
  const userCreditCards = await db.creditCard.findMany({
    where: { userId },
    select: { id: true },
  });

  // Percorre todos os cartões do usuário e garante que as faturas estejam em dia
  for (const card of userCreditCards) {
    await updateCardInvoices(card.id);
  }
};
