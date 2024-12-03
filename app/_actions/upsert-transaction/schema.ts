import {
  TransactionType,
  TransactionPaymentMethod,
  ExpenseTransactionCategory,
} from "@prisma/client";
import { z } from "zod";

export const upsertExpenseTransactionSchema = z.object({
  name: z.string().trim().min(1),
  amount: z.number(),
  type: z.nativeEnum(TransactionType),
  expenseCategory: z.nativeEnum(ExpenseTransactionCategory),
  account: z.string().trim().min(1),
  paymentMethod: z.nativeEnum(TransactionPaymentMethod),
  date: z.date(),
});
