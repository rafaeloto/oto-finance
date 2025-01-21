import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";

type params = {
  invoiceId: string;
};

export const getTransactionsByInvoice = async ({ invoiceId }: params) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!invoiceId) {
    throw new Error("Missing 'invoiceId'");
  }

  return db.transaction.findMany({
    where: {
      invoiceId,
      userId,
    },
  });
};
