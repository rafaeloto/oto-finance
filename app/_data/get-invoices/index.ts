import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";

type params = {
  creditCardId: string;
};

export const getInvoices = async ({ creditCardId }: params) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!creditCardId) {
    throw new Error("Missing 'creditCardId'");
  }

  return db.invoice.findMany({
    where: {
      creditCardId,
    },
  });
};
