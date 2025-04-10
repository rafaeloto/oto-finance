import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { getMonthDateRange } from "@utils/date";

export const getCurrentMonthTransactions = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const today = new Date();
  const year = String(today.getUTCFullYear());
  const month = String(today.getUTCMonth() + 1).padStart(2, "0");

  const { start, end } = getMonthDateRange(month, year);

  return db.transaction.count({
    where: {
      userId,
      createdAt: {
        gte: start,
        lte: end,
      },
    },
  });
};
