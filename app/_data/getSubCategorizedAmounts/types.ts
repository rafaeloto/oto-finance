import { TransactionPerCategory } from "../getCategorizedAmounts/types";

export type TransactionsPerParentCategory = {
  parentCategoryId: string;
  categories: TransactionPerCategory[];
};
