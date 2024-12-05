import { CreditCardFlag } from "@prisma/client";

export const CREDIT_CARD_LABELS = {
  [CreditCardFlag.ALELO]: "Alelo",
  [CreditCardFlag.AMEX]: "American Express",
  [CreditCardFlag.DINERS]: "Diners",
  [CreditCardFlag.ELO]: "Elo",
  [CreditCardFlag.HIPERCARD]: "Hipercard",
  [CreditCardFlag.MASTERCARD]: "Mastercard",
  [CreditCardFlag.VISA]: "Visa",
};

export const CREDIT_CARD_OPTIONS = Object.entries(CREDIT_CARD_LABELS).map(
  ([value, label]) => ({
    value,
    label,
  }),
);
