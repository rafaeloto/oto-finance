"use client";

import { Account, CreditCard, Invoice, Transaction } from "@prisma/client";
import { DataTable } from "@/app/_components/ui/data-table";
import { getTransactionColumns } from "../_columns";

interface TransactionsTableProps {
  transactions: Transaction[];
  creditCards: CreditCard[];
  accounts: Account[];
  paidInvoices: Invoice[];
}

export const TransactionsTable = ({
  transactions,
  creditCards,
  accounts,
  paidInvoices,
}: TransactionsTableProps) => {
  const columns = getTransactionColumns({
    creditCards,
    accounts,
    paidInvoices,
  });

  return (
    <DataTable
      columns={columns}
      data={JSON.parse(JSON.stringify(transactions))}
    />
  );
};
