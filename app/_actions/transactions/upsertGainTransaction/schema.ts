import { z } from "zod";

export const upsertGainTransactionSchema = z.object({
  name: z.string().trim().min(1),
  amount: z.number(),
  categoryId: z.string().trim().min(1),
  accountId: z.string().trim().min(1),
  date: z.date(),
});
