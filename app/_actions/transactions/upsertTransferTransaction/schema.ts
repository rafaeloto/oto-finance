import { z } from "zod";
import { TransferTransactionCategory } from "@prisma/client";

export const upsertTransferTransactionSchema = z.object({
  name: z.string().trim().min(1),
  amount: z.number(),
  categoryId: z.string().trim().min(1),
  // TODO: Remove transferCategory
  transferCategory: z.nativeEnum(TransferTransactionCategory),
  fromAccountId: z.string().trim().min(1),
  toAccountId: z.string().trim().min(1),
  date: z.date(),
});
