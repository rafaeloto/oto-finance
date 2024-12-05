import { z } from "zod";
import { CreditCardFlag } from "@prisma/client";

export const createCreditCardSchema = z.object({
  name: z.string().trim().min(1),
  limit: z.number().positive(),
  closingDate: z.number().int().min(1).max(31),
  dueDate: z.number().int().min(1).max(31),
  flag: z.nativeEnum(CreditCardFlag),
});
