import { db } from "@/app/_lib/prisma";

const getTransaction = async (id?: string) => {
  if (!id) return null;

  return db.transaction.findUnique({
    where: { id },
  });
};

export default getTransaction;
