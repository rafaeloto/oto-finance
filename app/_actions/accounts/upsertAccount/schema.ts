import { Bank } from "@prisma/client";
import { z } from "zod";

export const upsertAccountSchema = z.object({
  name: z.string().trim().min(1),
  bank: z.nativeEnum(Bank),
  initialBalance: z.number(),
});
