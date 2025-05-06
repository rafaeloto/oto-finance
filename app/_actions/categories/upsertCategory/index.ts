"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { TransactionType } from "@prisma/client";
import { upsertCategorySchema } from "./schema";

interface UpsertCategoryParams {
  id?: string;
  name: string;
  type: TransactionType;
  parentId?: string;
  icon?: string;
  color?: string;
}

export const upsertCategory = async (params: UpsertCategoryParams) => {
  upsertCategorySchema.parse(params);

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  await db.category.upsert({
    update: { ...params, userId },
    create: { ...params, userId },
    where: { id: params?.id ?? "" },
  });
};
