import { TransactionType } from "@prisma/client";

export type TransactionPercentagePerType = {
  [key in Exclude<TransactionType, "TRANSFER">]: number;
};

export interface TotalExpensePerCategory {
  category: string;
  totalAmount: number;
  percentageOfTotal: number;
}
