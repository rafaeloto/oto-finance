import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const getCreditCards = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return db.creditCard.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};
