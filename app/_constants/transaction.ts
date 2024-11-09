import {
  TransactionPaymentMethod,
  TransactionCategory,
  TransactionType,
} from "@prisma/client";

export const TRANSACTION_PAYMENT_METHOD_ICONS = {
  [TransactionPaymentMethod.CREDIT]: "credit-card.svg",
  [TransactionPaymentMethod.DEBIT]: "pix.svg",
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

export const TRANSACTION_CATEGORY_LABELS = {
  [TransactionCategory.FOOD]: "Alimentação",
  [TransactionCategory.INVESTMENT_DEPOSIT]: "Aporte de investimento",
  [TransactionCategory.CASHBACK]: "Cashback",
  [TransactionCategory.EDUCATION]: "Educação",
  [TransactionCategory.GOALS]: "Metas",
  [TransactionCategory.INVESTMENT_RETURN]: "Retorno de investimento",
  [TransactionCategory.HEALTH]: "Saúde",
  [TransactionCategory.TAXES]: "Imposto",
  [TransactionCategory.ENTERTAINMENT]: "Lazer",
  [TransactionCategory.LIVING]: "Moradia",
  [TransactionCategory.LOAN]: "Empréstimo",
  [TransactionCategory.PERSONAL]: "Pessoal",
  [TransactionCategory.PET]: "Pet",
  [TransactionCategory.REWARD]: "Prêmio",
  [TransactionCategory.GIFT]: "Presente",
  [TransactionCategory.SALE]: "Venda",
  [TransactionCategory.SALARY]: "Salário",
  [TransactionCategory.SUBSCRIPTION]: "Assinatura",
  [TransactionCategory.CLOTHING]: "Roupa",
  [TransactionCategory.OTHER]: "Outros",
  [TransactionCategory.TRANSPORTATION]: "Transporte",
  [TransactionCategory.TRAVEL]: "Viagem",
  [TransactionCategory.INVESTMENT_WITHDRAW]: "Resgate de investimento",
  [TransactionCategory.VARIABLE]: "Variável",
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
}));

export const TRANSACTION_CATEGORY_OPTIONS = Object.entries(
  TRANSACTION_CATEGORY_LABELS,
).map(([value, label]) => ({
  value,
  label,
}));
