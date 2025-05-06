import { z } from "zod";
import { TransactionType } from "@prisma/client";
import { ICON_OPTIONS } from "@molecules/IconPicker";
import { type LucideIconName } from "@atoms/Icon";

export const upsertCategorySchema = z.object({
  name: z.string().trim().min(1),
  type: z.nativeEnum(TransactionType),
  parentId: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/),
  icon: z
    .string()
    .refine(
      (val) =>
        typeof val === "string" && ICON_OPTIONS.includes(val as LucideIconName),
    ),
});
