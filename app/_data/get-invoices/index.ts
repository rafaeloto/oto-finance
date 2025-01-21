import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { InvoiceStatus } from "@prisma/client";

type params = {
  creditCardId?: string;
  status?: InvoiceStatus;
};

export const getInvoices = async ({ creditCardId, status }: params = {}) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return db.invoice.findMany({
    where: {
      userId,
      ...(creditCardId && { creditCardId }),
      ...(status && { status }),
    },
  });
};
