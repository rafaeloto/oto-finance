"use client";

import { Account, CreditCard, Invoice, Transaction } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import TransactionTypeBadge from "../_components/type-badge";
import {
  TRANSACTION_PAYMENT_METHOD_LABELS,
  GAIN_TRANSACTION_CATEGORY_LABELS,
  EXPENSE_TRANSACTION_CATEGORY_LABELS,
  INVESTMENT_TRANSACTION_CATEGORY_LABELS,
  TRANSFER_TRANSACTION_CATEGORY_LABELS,
} from "@constants/transaction";
import EditTransactionButton from "../_components/edit-transaction-button";
import DeleteTransactionButton from "../_components/delete-transaction-button";
import { Redo2 } from "lucide-react";
import { ImageAndLabelOption } from "@molecules/ImageAndLabelOption";
import AmountText from "@molecules/AmountText";
import TransactionInstallments from "@molecules/TransactionInstallments";

interface Props {
  creditCards: CreditCard[];
  accounts: Account[];
  paidInvoices: Invoice[];
}

export function getTransactionColumns({
  creditCards,
  accounts,
  paidInvoices,
}: Props): ColumnDef<Transaction>[] {
  return [
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row: { original: transaction } }) => (
        <div className="flex gap-3">
          <p>{transaction.name}</p>
          <TransactionInstallments transaction={transaction} />
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Tipo",
      cell: ({ row: { original: transaction } }) => (
        <TransactionTypeBadge type={transaction.type} />
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
              ? TRANSFER_TRANSACTION_CATEGORY_LABELS[
                  transaction.transferCategory
                ]
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
      accessorKey: "bankOrCard",
      header: "Banco / Cartão",
      cell: ({ row: { original: transaction } }) => {
        if (transaction.type === "TRANSFER") {
          const fromAccount = accounts.find(
            (account) => account.id === transaction.fromAccountId,
          );
          const toAcount = accounts.find(
            (account) => account.id === transaction.toAccountId,
          );
          return (
            <div className="flex items-center space-x-5">
              <div className="space-y-3">
                <ImageAndLabelOption
                  src={`/banks/${fromAccount?.bank || "OTHER"}.svg`}
                  label={fromAccount?.name || "Conta"}
                />
                <ImageAndLabelOption
                  src={`/banks/${toAcount?.bank || "OTHER"}.svg`}
                  label={toAcount?.name || "Conta"}
                />
              </div>

              <Redo2 size={20} className="rotate-180" />
            </div>
          );
        }

        if (transaction.paymentMethod === "CREDIT") {
          const creditCard = creditCards.find(
            (card) => card.id === transaction.cardId,
          );
          return (
            <ImageAndLabelOption
              src={`/credit-cards/${creditCard?.flag || "OTHER"}.svg`}
              label={creditCard?.name || "Cartão"}
            />
          );
        }

        if (transaction.paymentMethod === "DEBIT") {
          const account = accounts.find(
            (account) => account.id === transaction.accountId,
          );
          return (
            <ImageAndLabelOption
              src={`/banks/${account?.bank || "OTHER"}.svg`}
              label={account?.name || "Conta"}
            />
          );
        }
      },
    },
    {
      accessorKey: "date",
      header: "Data",
      cell: ({ row: { original: transaction } }) =>
        new Date(transaction.date).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }),
    },
    {
      accessorKey: "amount",
      header: "Valor",
      cell: ({ row: { original: transaction } }) => (
        <AmountText transaction={transaction} />
      ),
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row: { original: transaction } }) => {
        const isEditableTransaction =
          !transaction.invoiceId ||
          !paidInvoices?.some(({ id }) => id === transaction.invoiceId);

        return (
          <div
            className="flex justify-end space-x-1"
            {...(!isEditableTransaction && { style: { display: "none" } })}
          >
            <EditTransactionButton transaction={transaction} />
            <DeleteTransactionButton transactionId={transaction.id} />
          </div>
        );
      },
    },
  ];
}
