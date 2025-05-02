"use client";

import {
  Account,
  Category,
  CreditCard,
  Invoice,
  Transaction,
} from "@prisma/client";
import { DataTable } from "@shadcn/data-table";
import { getTransactionColumns } from "../_columns";

interface TransactionsTableProps {
  transactions: Transaction[];
  creditCards: CreditCard[];
  accounts: Account[];
  categories: Category[];
  paidInvoices: Invoice[];
}

export const TransactionsTable = ({
  transactions,
  creditCards,
  accounts,
  categories,
  paidInvoices,
}: TransactionsTableProps) => {
  const columns = getTransactionColumns({
    creditCards,
    accounts,
    categories,
    paidInvoices,
  });

  return (
    <DataTable
      columns={columns}
      data={JSON.parse(JSON.stringify(transactions))}
      minRowHeight={73}
    />
  );
};
