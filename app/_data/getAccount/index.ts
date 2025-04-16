import { db } from "@/app/_lib/prisma";
import { Prisma } from "@prisma/client";

type params = {
  id?: string;
  client?: Omit<Prisma.TransactionClient, "$transaction">;
};

const getAccount = async ({ id, client }: params) => {
  if (!id) return null;

  // Uses the transactional client, if provided, or the default client.
  const prismaClient = client ?? db;

  return prismaClient.account.findUnique({
    where: { id },
  });
};

export default getAccount;
