import { z } from "zod";
import {
  TransactionPaymentMethod,
  ExpenseTransactionCategory,
} from "@prisma/client";

export const upsertExpenseTransactionSchema = z.object({
  name: z.string().trim().min(1),
  amount: z.number(),
  expenseCategory: z.nativeEnum(ExpenseTransactionCategory),
  accountId: z.string().trim().min(1),
  paymentMethod: z.nativeEnum(TransactionPaymentMethod),
  date: z.date(),
});
