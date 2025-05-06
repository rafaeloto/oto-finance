import { z } from "zod";
import { TransactionType } from "@prisma/client";

export const upsertCategorySchema = z.object({
  name: z.string().trim().min(1),
  type: z.nativeEnum(TransactionType),
  parentId: z.string().optional(),
});
