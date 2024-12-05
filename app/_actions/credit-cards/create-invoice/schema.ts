import { z } from "zod";

export const createInvoiceSchema = z.object({
  creditCardId: z.string().uuid(),
  month: z.number().min(1).max(12),
  year: z.number().min(2000).max(4000),
});
