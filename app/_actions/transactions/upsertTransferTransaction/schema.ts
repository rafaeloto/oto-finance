import { z } from "zod";

export const upsertTransferTransactionSchema = z.object({
  name: z.string().trim().min(1),
  amount: z.number().positive(),
  categoryId: z.string().trim().min(1),
  fromAccountId: z.string().trim().min(1),
  toAccountId: z.string().trim().min(1),
  date: z.date(),
});
