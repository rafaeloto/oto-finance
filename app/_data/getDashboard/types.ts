import { ExpenseTransactionCategory, TransactionType } from "@prisma/client";

export type TransactionPercentagePerType = {
  [key in Exclude<TransactionType, "TRANSFER">]: number;
};

export interface TotalExpensePerCategory {
  category: ExpenseTransactionCategory;
  totalAmount: number;
  percentageOfTotal: number;
}
