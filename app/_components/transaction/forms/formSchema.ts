import {
  ExpenseTransactionCategory,
  GainTransactionCategory,
  InvestmentTransactionCategory,
  TransactionPaymentMethod,
} from "@prisma/client";
import { z } from "zod";

export const formSchemas = {
  expense: z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    amount: z.number(),
    expenseCategory: z.nativeEnum(ExpenseTransactionCategory),
    account: z.string().min(1, "A conta é obrigatória"),
    paymentMethod: z.nativeEnum(TransactionPaymentMethod),
    date: z.date({ required_error: "A data é obrigatória" }),
  }),
  gain: z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    amount: z.number(),
    gainCategory: z.nativeEnum(GainTransactionCategory),
    account: z.string().min(1, "A conta é obrigatória"),
    date: z.date({ required_error: "A data é obrigatória" }),
  }),
  transfer: z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    amount: z.number(),
    fromAccount: z.string().min(1, "A conta de origem é obrigatória"),
    toAccount: z.string().min(1, "A conta de destino é obrigatória"),
    date: z.date({ required_error: "A data é obrigatória" }),
  }),
  investment: z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    amount: z.number().positive("O valor deve ser positivo"),
    investmentCategory: z.nativeEnum(InvestmentTransactionCategory),
    account: z.string().min(1, "A conta é obrigatória"),
  }),
};
