import { z } from "zod";
import {
  TransactionPaymentMethod,
  ExpenseTransactionCategory,
} from "@prisma/client";

export const upsertExpenseTransactionSchema = z.object({
  name: z.string().trim().min(1),
  amount: z.number().min(1),
  expenseCategory: z.nativeEnum(ExpenseTransactionCategory),
  paymentMethod: z.nativeEnum(TransactionPaymentMethod),
  accountId: z.string().optional(),
  cardId: z.string().optional(),
  invoiceId: z.string().optional(),
  date: z.date(),
});
