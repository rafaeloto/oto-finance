import { Bank } from "@prisma/client";

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

export const BANK_OPTIONS = Object.entries(BANK_LABELS).map(
  ([value, label]) => ({
    value,
    label,
  }),
);
