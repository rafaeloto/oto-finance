import { auth } from "@clerk/nextjs/server";
import { db } from "@/app/_lib/prisma";

export const getTotalBalance = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const totalBalance = Number(
    (
      await db.account.aggregate({
        where: { userId },
        _sum: { balance: true },
      })
    )?._sum?.balance,
  );

  return totalBalance;
};
