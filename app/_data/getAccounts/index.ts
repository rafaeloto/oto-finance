import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const getAccounts = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return db.account.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};
