import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";

type params = {
  id: string;
};

export const getCreditCardById = async ({ id }: params) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!id) {
    throw new Error("Missing credit card 'id'");
  }

  return db.creditCard.findUnique({
    where: {
      id,
      userId,
    },
  });
};
