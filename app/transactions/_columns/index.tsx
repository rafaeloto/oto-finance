"use client";

import { Account, Transaction } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import TransactionTypeBadge from "../_components/type-badge";
import {
  TRANSACTION_PAYMENT_METHOD_LABELS,
  GAIN_TRANSACTION_CATEGORY_LABELS,
  EXPENSE_TRANSACTION_CATEGORY_LABELS,
  INVESTMENT_TRANSACTION_CATEGORY_LABELS,
  TRANSFER_TRANSACTION_CATEGORY_LABELS,
} from "@/app/_constants/transaction";
import EditTransactionButton from "../_components/edit-transaction-button";
import DeleteTransactionButton from "../_components/delete-transaction-button";

export const getTransactionColumns = (
  accounts: Account[],
): ColumnDef<Transaction>[] => [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row: { original: transaction } }) => (
      <TransactionTypeBadge transaction={transaction} />
    ),
  },
  {
    accessorKey: "category",
    header: "Categoria",
    cell: ({ row: { original: transaction } }) => {
      let categoryLabel = "";
      switch (transaction.type) {
        case "GAIN":
          categoryLabel = transaction.gainCategory
            ? GAIN_TRANSACTION_CATEGORY_LABELS[transaction.gainCategory]
            : "Não especificado";
          break;
        case "EXPENSE":
          categoryLabel = transaction.expenseCategory
            ? EXPENSE_TRANSACTION_CATEGORY_LABELS[transaction.expenseCategory]
            : "Não especificado";
          break;
        case "INVESTMENT":
          categoryLabel = transaction.investmentCategory
            ? INVESTMENT_TRANSACTION_CATEGORY_LABELS[
                transaction.investmentCategory
              ]
            : "Não especificado";
          break;
        case "TRANSFER":
          categoryLabel = transaction.transferCategory
            ? TRANSFER_TRANSACTION_CATEGORY_LABELS[transaction.transferCategory]
            : "Não especificado";
          break;
        default:
          categoryLabel = "Não especificado";
      }

      return <p>{categoryLabel}</p>;
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Método de pagamento",
    cell: ({ row: { original: transaction } }) => (
      <p>{TRANSACTION_PAYMENT_METHOD_LABELS[transaction.paymentMethod]}</p>
    ),
  },
  {
    accessorKey: "date",
    header: "Data",
    cell: ({ row: { original: transaction } }) =>
      new Date(transaction.date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
  },
  {
    accessorKey: "amount",
    header: "Valor",
    cell: ({ row: { original: transaction } }) =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(Number(transaction.amount)),
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row: { original: transaction } }) => {
      return (
        <div className="space-x-1">
          <EditTransactionButton
            transaction={transaction}
            accounts={accounts}
          />
          <DeleteTransactionButton transactionId={transaction.id} />
        </div>
      );
    },
  },
];
