import { Bank } from "@prisma/client";
import { z } from "zod";

export const createAccountSchema = z.object({
  name: z.string().trim().min(1),
  bank: z.nativeEnum(Bank),
  balance: z.number().optional(),
});
