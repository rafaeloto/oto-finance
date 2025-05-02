import {
  ExpenseTransactionCategory,
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
      installmentType: z.enum(["once", "split"]).optional(),
      invoiceMonth: z.number().optional(),
      invoiceYear: z.number().optional(),
      installments: z.number().max(12, "O máximo de parcelas é 12").optional(),
      date: z.date({ required_error: "A data é obrigatória" }),
    })
    .superRefine((data, ctx) => {
      // If paymentMethod is 'CREDIT', cardId, invoiceMonth and invoiceYear are required
      if (data.paymentMethod === TransactionPaymentMethod.CREDIT) {
        if (!data.cardId) {
          ctx.addIssue({
            path: ["cardId"],
            message: "O cartão de crédito é obrigatório",
            code: z.ZodIssueCode.custom,
          });
        }
        if (!data.invoiceMonth) {
          ctx.addIssue({
            path: ["invoiceMonth"],
            message: !data.cardId
              ? "Selecione um cartão"
              : "A fatura é obrigatória",
            code: z.ZodIssueCode.custom,
          });
        }
        if (!data.invoiceYear) {
          ctx.addIssue({
            path: ["invoiceYear"],
            message: !data.cardId
              ? "Selecione um cartão"
              : !data.invoiceMonth
                ? "Selecione uma fatura"
                : "O ano da fatura é obrigatório",
            code: z.ZodIssueCode.custom,
          });
        }
        if (!data.installmentType) {
          ctx.addIssue({
            path: ["installmentType"],
            message: "Selecione um tipo de parcelamento",
            code: z.ZodIssueCode.custom,
          });
        }
        if (
          data.installmentType === "split" &&
          (!data.installments || data.installments < 2)
        ) {
          ctx.addIssue({
            path: ["installments"],
            message: "Selecione pelo menos duas parcelas",
            code: z.ZodIssueCode.custom,
          });
        }
      }

      // If paymentMethod is 'DEBIT', accountId is required
      if (
        data.paymentMethod === TransactionPaymentMethod.DEBIT &&
        !data.accountId
      ) {
        ctx.addIssue({
          path: ["accountId"],
          message: "A conta é obrigatória",
          code: z.ZodIssueCode.custom,
        });
      }
    }),

  gain: z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    amount: z.number(),
    categoryId: z.string().min(1, "A categoria é obrigatória"),
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
