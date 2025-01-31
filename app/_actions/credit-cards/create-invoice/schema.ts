import { z } from "zod";
import { InvoiceStatus } from "@prisma/client";

export const createInvoiceSchema = z.object({
  creditCardId: z.string().uuid(),
  month: z.number().min(1).max(12),
  year: z.number().min(2000).max(4000),
  status: z.nativeEnum(InvoiceStatus).optional(),
});
