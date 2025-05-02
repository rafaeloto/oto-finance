import {
  ExpenseTransactionCategory,
  GainTransactionCategory,
  InvestmentTransactionCategory,
  TransferTransactionCategory,
} from "@prisma/client";

export const gainMap: Record<GainTransactionCategory, string> = {
  CASHBACK: "4878e701-1daa-4735-b33c-17d73fd2edf9",
  GIFT: "26b17439-e4e0-416b-8139-76d605057520",
  LOAN: "565e6139-57b6-44fb-abf9-5d015005ba47",
  OTHER: "ab8afbae-e43c-4f7f-b3b9-46580e4fbba7",
  REWARD: "60a83029-7eb4-412f-867f-2180b4884cb0",
  SALE: "92bc1833-cef7-4710-bf80-2fe7b94ec14c",
  SALARY: "f26c9d4c-abf7-45b2-a742-b704f03cfdd2",
  VARIABLE: "99b74f15-7ecf-4019-b68e-25ef456dbfbe",
};

export const expenseMap: Record<ExpenseTransactionCategory, string> = {
  CLOTHING: "6fbeb945-f632-4c70-8219-8668d4bd32a5",
  EDUCATION: "f1b1e9c4-0fa1-42d4-81d5-cb8d06fd7656",
  ENTERTAINMENT: "1d4de633-96cf-414c-9ca6-e9658cb5afb1",
  FOOD: "7335890f-6cdb-49c8-9dd7-91f68600a588",
  GIFT: "5e304592-f973-4942-8bf0-eed8ad949b2c",
  GOALS: "d842eb12-11cf-41d8-a57c-654ccc88ef62",
  HEALTH: "a8e60e9a-5059-4e7f-8abb-ba27b090bcc2",
  LIVING: "53dcd380-7b3a-45e8-9f4c-fe73619f214c",
  LOAN: "b9827a4b-35a7-4169-b276-f26e32455587",
  OTHER: "6879d67f-4df1-4c81-bceb-7adfec9c745e",
  PERSONAL: "f0def54f-32cd-49d1-9b97-25623d6e3bb2",
  PET: "a758d74b-90a9-460f-91aa-bf9186a311c0",
  PURCHASE: "1c42fe92-6e94-48cd-a331-e0b0671e6fe8",
  SUBSCRIPTION: "22b97189-bf0b-4f6f-bc6d-083f8522cd81",
  TAXES: "be640acc-d9fe-4631-a367-8fede8a9bd7a",
  TRANSPORTATION: "9c1b5e94-116b-41f6-b2fc-94368af3d900",
  TRAVEL: "5941184a-3d6b-4135-b2d5-3267c79e2416",
};

export const investmentMap: Record<InvestmentTransactionCategory, string> = {
  INVESTMENT_NEGATIVE_RETURN: "81ead95a-05ac-49bc-8f06-f3ac113480fe",
  INVESTMENT_POSITIVE_RETURN: "f8fad873-907c-4ee6-ba60-a59fbc391854",
};

export const transferMap: Record<TransferTransactionCategory, string> = {
  TRANSFER: "885547a6-eeac-4967-a1ea-383642fd5c55",
  INVESTMENT_DEPOSIT: "7a743975-2b6c-47cc-8426-e93d835049e0",
  INVESTMENT_WITHDRAW: "450932a0-c34a-4283-9916-7e900be25fc7",
};
