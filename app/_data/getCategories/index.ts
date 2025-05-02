import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { TransactionType } from "@prisma/client";

type GetCategoriesParams = {
  type: TransactionType;
};

export const getCategories = async ({ type }: GetCategoriesParams) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return db.category.findMany({
    where: {
      type,
      OR: [{ userId: userId }, { userId: null }],
    },
    orderBy: {
      name: "asc",
    },
  });
};
