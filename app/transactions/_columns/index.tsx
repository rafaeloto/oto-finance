"use client";

import {
  Account,
  Category,
  CreditCard,
  Invoice,
  Transaction,
} from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import TransactionTypeBadge from "../_components/TransactionTypeBadge";
import { TRANSACTION_PAYMENT_METHOD_LABELS } from "@constants/transaction";
import EditTransactionButton from "@components/transaction/buttons/EditTransactionButton";
import DeleteTransactionButton from "@components/transaction/buttons/DeleteTransactionButton";
import Icon, { type LucideIconName } from "@atoms/Icon";
import { ImageAndLabelOption } from "@molecules/ImageAndLabelOption";
import AmountText from "@molecules/AmountText";
import TransactionInstallments from "@molecules/TransactionInstallments";
import ShouldRender from "@atoms/ShouldRender";

interface Props {
  creditCards: CreditCard[];
  accounts: Account[];
  categories: Category[];
  paidInvoices: Invoice[];
  theme?: string;
}

export function getTransactionColumns({
  creditCards,
  accounts,
  categories,
  paidInvoices,
  theme,
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
        const category = categories?.find(
          (category) => category.id === transaction.categoryId,
        );

        const parentCategory = categories?.find(
          (cat) => cat.id === category?.parentId,
        );

        return (
          <div className="flex items-center gap-3">
            <Icon
              name={category?.icon as LucideIconName}
              {...(category?.color && {
                color:
                  category.color === "#ffff" && theme === "light"
                    ? "#000"
                    : category.color,
              })}
            />
            <div className="flex flex-col items-start">
              <span>{category?.name}</span>
              <ShouldRender if={!!parentCategory}>
                <p className="text-xs text-muted-foreground">
                  {parentCategory?.name}
                </p>
              </ShouldRender>
            </div>
          </div>
        );
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

              <Icon name="Redo2" size={20} className="rotate-180" />
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
