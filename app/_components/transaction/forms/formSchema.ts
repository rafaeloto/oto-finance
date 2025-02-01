import {
  ExpenseTransactionCategory,
  GainTransactionCategory,
  TransferTransactionCategory,
  InvestmentTransactionCategory,
  TransactionPaymentMethod,
} from "@prisma/client";
import { z } from "zod";

export const formSchemas = {
  expense: z
    .object({
      name: z.string().min(1, "O nome é obrigatório"),
      amount: z.number().positive("O valor deve ser positivo"),
      expenseCategory: z.nativeEnum(ExpenseTransactionCategory),
      paymentMethod: z.nativeEnum(TransactionPaymentMethod),
      accountId: z.string().optional(),
      cardId: z.string().optional(),
      invoiceMonth: z.number().optional(),
      date: z.date({ required_error: "A data é obrigatória" }),
    })
    .superRefine((data, ctx) => {
      // If paymentMethod is 'CREDIT', cardId and invoiceMonth must be required
      if (data.paymentMethod === TransactionPaymentMethod.CREDIT) {
        if (!data.cardId) {
          ctx.addIssue({
            path: ["cardId"],
            message: "O cartão de crédito é obrigatório.",
            code: z.ZodIssueCode.custom,
          });
        }
        if (!data.invoiceMonth) {
          ctx.addIssue({
            path: ["invoiceMonth"],
            message: "A fatura é obrigatória.",
            code: z.ZodIssueCode.custom,
          });
        }
      }

      // If paymentMethod is 'DEBIT', accountId must be required
      if (
        data.paymentMethod === TransactionPaymentMethod.DEBIT &&
        !data.accountId
      ) {
        ctx.addIssue({
          path: ["accountId"],
          message: "A conta é obrigatória.",
          code: z.ZodIssueCode.custom,
        });
      }
    }),

  gain: z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    amount: z.number(),
    gainCategory: z.nativeEnum(GainTransactionCategory),
    accountId: z.string().min(1, "A conta é obrigatória"),
    date: z.date({ required_error: "A data é obrigatória" }),
  }),

  transfer: z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    amount: z.number(),
    transferCategory: z.nativeEnum(TransferTransactionCategory),
    fromAccountId: z.string().min(1, "A conta de origem é obrigatória"),
    toAccountId: z.string().min(1, "A conta de destino é obrigatória"),
    date: z.date({ required_error: "A data é obrigatória" }),
  }),

  investment: z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    amount: z.number().positive("O valor deve ser positivo"),
    investmentCategory: z.nativeEnum(InvestmentTransactionCategory),
    accountId: z.string().min(1, "A conta é obrigatória"),
    date: z.date({ required_error: "A data é obrigatória" }),
  }),
};
