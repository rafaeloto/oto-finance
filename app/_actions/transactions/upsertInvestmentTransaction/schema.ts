import { z } from "zod";
import { InvestmentTransactionCategory } from "@prisma/client";

export const upsertInvestmentTransactionSchema = z.object({
  name: z.string().trim().min(1),
  amount: z.number(),
  categoryId: z.string().trim().min(1),
  // TODO: Remove investmentCategory
  investmentCategory: z.nativeEnum(InvestmentTransactionCategory),
  accountId: z.string().trim().min(1),
  date: z.date(),
});
