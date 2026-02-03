import { getMonthDateRange } from "./date";
import { GAIN_MAP, EXPENSE_MAP } from "@constants/category";
import { TransactionPaymentMethod } from "@prisma/client";

export const getTransactionsWhereClause = (
  month: string,
  year: string,
  userId: string,
  ignoreLoans: boolean,
  cashflowView: boolean,
) => {
  const { start, end } = getMonthDateRange(month, year);

  const baseFilters = {
    userId,
    ...(ignoreLoans && {
      NOT: [{ categoryId: GAIN_MAP.LOAN }, { categoryId: EXPENSE_MAP.LOAN }],
    }),
  };

  const baseDateRange = { date: { gte: start, lte: end } };

  const defaultWhere = {
    ...baseFilters,
    ...baseDateRange,
  };

  const expenseCashflowWhere = {
    ...baseFilters,
    OR: [
      {
        paymentMethod: TransactionPaymentMethod.DEBIT,
        ...baseDateRange,
      },
      {
        paymentMethod: TransactionPaymentMethod.CREDIT,
        invoice: {
          month: Number(month),
          year: Number(year),
        },
      },
    ],
  };

  return cashflowView ? expenseCashflowWhere : defaultWhere;
};
