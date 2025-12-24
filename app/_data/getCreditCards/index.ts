import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { parseDecimals } from "@utils/transform";

export const getCreditCards = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const creditCards = await db.creditCard.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return parseDecimals(creditCards);
};
