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

export const CARD_COLORS_OPTIONS = [
  { label: "Preto", value: "from-black via-gray-950 to-black" },
  { label: "Cinza", value: "from-gray-700 via-gray-800 to-gray-900" },
  { label: "Roxo", value: "from-purple-700 via-purple-800 to-purple-900" },
  { label: "Azul", value: "from-blue-700 via-blue-800 to-blue-900" },
  { label: "Verde", value: "from-green-700 via-green-800 to-green-900" },
  { label: "Amarelo", value: "from-yellow-500 via-yellow-500 to-yellow-600" },
  { label: "Laranja", value: "from-orange-500 via-orange-600 to-orange-700" },
  { label: "Vermelho", value: "from-red-700 via-red-800 to-red-900" },
];
