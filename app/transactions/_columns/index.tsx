"use client";

import {
  PaymentMethod,
  Transaction,
  TransactionCategory,
} from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import TransactionTypeBadge from "../_components/type-badge";
import { Button } from "@/app/_components/ui/button";
import { PencilIcon, TrashIcon } from "lucide-react";

const transactionCategoryMap = {
  [TransactionCategory.CASHBACK]: "Cashback",
  [TransactionCategory.CLOTHING]: "Roupa",
  [TransactionCategory.EDUCATION]: "Educação",
  [TransactionCategory.ENTERTAINMENT]: "Lazer",
  [TransactionCategory.FOOD]: "Comida",
  [TransactionCategory.GIFT]: "Presente",
  [TransactionCategory.GOALS]: "Metas",
  [TransactionCategory.HEALTH]: "Saúde",
  [TransactionCategory.INVESTMENT]: "Aporte de investimento",
  [TransactionCategory.LIVING]: "Moradia",
  [TransactionCategory.LOAN]: "Empréstimo",
  [TransactionCategory.OTHER]: "Outros",
  [TransactionCategory.PERSONAL]: "Pessoal",
  [TransactionCategory.PET]: "Pet",
  [TransactionCategory.REWARD]: "Prêmio",
  [TransactionCategory.RETURN_ON_INVESTMENT]: "Rendimento de investimento",
  [TransactionCategory.SALE]: "Venda",
  [TransactionCategory.SALARY]: "Salário",
  [TransactionCategory.SUBSCRIPTION]: "Assinatura",
  [TransactionCategory.TAXES]: "Imposto",
  [TransactionCategory.TRANSPORTATION]: "Transporte",
  [TransactionCategory.TRAVEL]: "Viagem",
  [TransactionCategory.VARIABLE]: "Variável",
};

const paymentMethodMap = {
  [PaymentMethod.CREDIT]: "Crédito",
  [PaymentMethod.DEBIT]: "Débito",
};

export const transactionColumns: ColumnDef<Transaction>[] = [
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
    cell: ({ row: { original: transaction } }) => (
      <p>{transactionCategoryMap[transaction.category]}</p>
    ),
  },
  {
    accessorKey: "paymentMethod",
    header: "Método de pagamento",
    cell: ({ row: { original: transaction } }) => (
      <p>{paymentMethodMap[transaction.paymentMethod]}</p>
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
    cell: () => {
      return (
        <div className="space-x-1">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <PencilIcon />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <TrashIcon />
          </Button>
        </div>
      );
    },
  },
];
