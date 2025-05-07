import { TransactionType, TransactionPaymentMethod } from "@prisma/client";

export const TRANSACTION_PAYMENT_METHOD_ICONS = {
  [TransactionPaymentMethod.CREDIT]: "CreditCard",
  [TransactionPaymentMethod.DEBIT]: "Banknote",
};

export const TRANSACTION_TYPE_LABELS = {
  [TransactionType.EXPENSE]: "Despesa",
  [TransactionType.GAIN]: "Receita",
  [TransactionType.TRANSFER]: "Transferência",
  [TransactionType.INVESTMENT]: "Investimento",
};

export const TRANSACTION_PAYMENT_METHOD_LABELS = {
  [TransactionPaymentMethod.CREDIT]: "Crédito",
  [TransactionPaymentMethod.DEBIT]: "Débito",
};

export const TRANSACTION_TYPE_OPTIONS = Object.entries(
  TRANSACTION_TYPE_LABELS,
).map(([value, label]) => ({
  value,
  label,
}));

export const TRANSACTION_PAYMENT_METHOD_OPTIONS = Object.entries(
  TRANSACTION_PAYMENT_METHOD_LABELS,
).map(([value, label]) => ({
  value,
  label,
  icon: TRANSACTION_PAYMENT_METHOD_ICONS[value as TransactionPaymentMethod],
}));
