import { z } from "zod";
import { GainTransactionCategory } from "@prisma/client";

export const upsertGainTransactionSchema = z.object({
  name: z.string().trim().min(1),
  amount: z.number(),
  // TODO: Remove gainCategory
  gainCategory: z.nativeEnum(GainTransactionCategory),
  categoryId: z.string().trim().min(1),
  accountId: z.string().trim().min(1),
  date: z.date(),
});
