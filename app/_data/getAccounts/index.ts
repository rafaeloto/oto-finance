import { db } from "@/app/_lib/prisma";
import { parseDecimals } from "@utils/transform";
import { auth } from "@clerk/nextjs/server";

export const getAccounts = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const accounts = await db.account.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return parseDecimals(accounts);
};
