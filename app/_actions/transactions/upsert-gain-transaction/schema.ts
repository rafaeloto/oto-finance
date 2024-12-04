import { z } from "zod";
import { GainTransactionCategory } from "@prisma/client";

export const upsertGainTransactionSchema = z.object({
  name: z.string().trim().min(1),
  amount: z.number(),
  gainCategory: z.nativeEnum(GainTransactionCategory),
  accountId: z.string().trim().min(1),
  date: z.date(),
});
