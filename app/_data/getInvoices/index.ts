import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { InvoiceStatus } from "@prisma/client";
import { parseDecimals } from "@utils/transform";

type params = {
  creditCardId?: string;
  status?: InvoiceStatus;
};

export const getInvoices = async ({ creditCardId, status }: params = {}) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const invoices = await db.invoice.findMany({
    where: {
      userId,
      ...(creditCardId && { creditCardId }),
      ...(status && { status }),
    },
  });

  return parseDecimals(invoices);
};
