import { db } from "@/app/_lib/prisma";
import { Prisma } from "@prisma/client";

type params = {
  id?: string;
  client?: Omit<Prisma.TransactionClient, "$transaction">;
};

const getTransaction = async ({ id, client }: params) => {
  if (!id) return null;

  // Uses the transactional client, if provided, or the default client.
  const prismaClient = client ?? db;

  return prismaClient.transaction.findUnique({
    where: { id },
  });
};

export default getTransaction;
