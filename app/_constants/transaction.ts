import {
  TransactionType,
  GainTransactionCategory,
  ExpenseTransactionCategory,
  InvestmentTransactionCategory,
  TransferTransactionCategory,
  TransactionPaymentMethod,
  Bank,
} from "@prisma/client";

export const TRANSACTION_PAYMENT_METHOD_ICONS = {
  [TransactionPaymentMethod.CREDIT]: "credit-card.svg",
  [TransactionPaymentMethod.DEBIT]: "pix.svg",
};

export const BANK_LABELS = {
  [Bank.PAY_99]: "99 Pay",
  [Bank.BANCO_DO_BRASIL]: "Banco do Brasil",
  [Bank.BRADESCO]: "Bradesco",
  [Bank.CAIXA_ECONOMICA]: "Caixa Econômica",
  [Bank.INTER]: "Inter",
  [Bank.ITAU]: "Itaú",
  [Bank.MERCADO_PAGO]: "Mercado Pago",
  [Bank.NEON]: "Neon",
  [Bank.NUBANK]: "Nubank",
  [Bank.PICPAY]: "Picpay",
  [Bank.SANTANDER]: "Santander",
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

export const GAIN_TRANSACTION_CATEGORY_LABELS = {
  [GainTransactionCategory.CASHBACK]: "Cashback",
  [GainTransactionCategory.LOAN]: "Empréstimo",
  [GainTransactionCategory.REWARD]: "Prêmio",
  [GainTransactionCategory.GIFT]: "Presente",
  [GainTransactionCategory.SALE]: "Venda",
  [GainTransactionCategory.SALARY]: "Salário",
  [GainTransactionCategory.OTHER]: "Outros",
  [GainTransactionCategory.VARIABLE]: "Variável",
};

export const EXPENSE_TRANSACTION_CATEGORY_LABELS = {
  [ExpenseTransactionCategory.FOOD]: "Alimentação",
  [ExpenseTransactionCategory.EDUCATION]: "Educação",
  [ExpenseTransactionCategory.GOALS]: "Metas",
  [ExpenseTransactionCategory.HEALTH]: "Saúde",
  [ExpenseTransactionCategory.TAXES]: "Imposto",
  [ExpenseTransactionCategory.ENTERTAINMENT]: "Lazer",
  [ExpenseTransactionCategory.LIVING]: "Moradia",
  [ExpenseTransactionCategory.LOAN]: "Empréstimo",
  [ExpenseTransactionCategory.PERSONAL]: "Pessoal",
  [ExpenseTransactionCategory.PET]: "Pet",
  [ExpenseTransactionCategory.GIFT]: "Presente",
  [ExpenseTransactionCategory.SUBSCRIPTION]: "Assinatura",
  [ExpenseTransactionCategory.CLOTHING]: "Roupa",
  [ExpenseTransactionCategory.OTHER]: "Outros",
  [ExpenseTransactionCategory.TRANSPORTATION]: "Transporte",
  [ExpenseTransactionCategory.TRAVEL]: "Viagem",
};

export const INVESTMENT_TRANSACTION_CATEGORY_LABELS = {
  [InvestmentTransactionCategory.INVESTMENT_NEGATIVE_RETURN]:
    "Retorno negativo de investimento",
  [InvestmentTransactionCategory.INVESTMENT_POSITIVE_RETURN]:
    "Retorno positivo de investimento",
};

export const TRANSFER_TRANSACTION_CATEGORY_LABELS = {
  [TransferTransactionCategory.TRANSFER]: "Transferência",
  [TransferTransactionCategory.INVESTMENT_DEPOSIT]: "Aporte de investimento",
  [TransferTransactionCategory.INVESTMENT_WITHDRAW]: "Resgate de investimento",
};

export const BANK_OPTIONS = Object.entries(BANK_LABELS).map(
  ([value, label]) => ({
    value,
    label,
  }),
);

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

export const GAIN_TRANSACTION_CATEGORY_OPTIONS = Object.entries(
  GAIN_TRANSACTION_CATEGORY_LABELS,
).map(([value, label]) => ({
  value,
  label,
}));

export const EXPENSE_TRANSACTION_CATEGORY_OPTIONS = Object.entries(
  EXPENSE_TRANSACTION_CATEGORY_LABELS,
).map(([value, label]) => ({
  value,
  label,
}));

export const INVESTMENT_TRANSACTION_CATEGORY_OPTIONS = Object.entries(
  INVESTMENT_TRANSACTION_CATEGORY_LABELS,
).map(([value, label]) => ({
  value,
  label,
}));

export const TRANSFER_TRANSACTION_CATEGORY_OPTIONS = Object.entries(
  TRANSFER_TRANSACTION_CATEGORY_LABELS,
).map(([value, label]) => ({
  value,
  label,
}));
