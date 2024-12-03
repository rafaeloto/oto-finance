import {
  TransactionPaymentMethod,
  ExpenseTransactionCategory,
  GainTransactionCategory,
  TransferTransactionCategory,
} from "@prisma/client";
import { z } from "zod";

export const upsertExpenseTransactionSchema = z.object({
  name: z.string().trim().min(1),
  amount: z.number(),
  expenseCategory: z.nativeEnum(ExpenseTransactionCategory),
  accountId: z.string().trim().min(1),
  paymentMethod: z.nativeEnum(TransactionPaymentMethod),
  date: z.date(),
});

export const upsertGainTransactionSchema = z.object({
  name: z.string().trim().min(1),
  amount: z.number(),
  gainCategory: z.nativeEnum(GainTransactionCategory),
  accountId: z.string().trim().min(1),
  date: z.date(),
});

export const upsertTransferTransactionSchema = z.object({
  name: z.string().trim().min(1),
  amount: z.number(),
  transferCategory: z.nativeEnum(TransferTransactionCategory),
  fromAccountId: z.string().trim().min(1),
  toAccountId: z.string().trim().min(1),
  date: z.date(),
});
