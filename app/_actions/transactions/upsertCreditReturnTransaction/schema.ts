import { z } from "zod";

export const upsertCreditReturnTransactionSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "O nome é obrigatório"),
  amount: z.number().positive("O valor deve ser positivo"),
  categoryId: z.string().min(1, "A categoria é obrigatória"),
  cardId: z.string().min(1, "O cartão de crédito é obrigatório"),
  invoiceMonth: z.number().min(1, "Selecione uma fatura"),
  invoiceYear: z.number().min(1, "O ano da fatura é obrigatório"),
  date: z.date({ required_error: "A data é obrigatória" }),
});

export type UpsertCreditReturnTransactionSchema = z.infer<
  typeof upsertCreditReturnTransactionSchema
>;
