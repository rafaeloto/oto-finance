"use client";

import { Account, CreditCard, Transaction } from "@prisma/client";
import { DataTable } from "@/app/_components/ui/data-table";
import { getTransactionColumns } from "../_columns";

interface TransactionsTableProps {
  transactions: Transaction[];
  creditCards: CreditCard[];
  accounts: Account[];
}

export const TransactionsTable = ({
  transactions,
  creditCards,
  accounts,
}: TransactionsTableProps) => {
  const columns = getTransactionColumns({ creditCards, accounts });

  return (
    <DataTable
      columns={columns}
      data={JSON.parse(JSON.stringify(transactions))}
    />
  );
};
