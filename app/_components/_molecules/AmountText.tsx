import { formatCurrency } from "@/app/_utils/currency";
import { Transaction, TransactionType } from "@prisma/client";

const getColorAndPrefix = (transaction: Transaction) => {
  const { type, investmentCategory } = transaction;

  const isPositive =
    type === TransactionType.GAIN ||
    investmentCategory === "INVESTMENT_POSITIVE_RETURN";
  const isNegative =
    type === TransactionType.EXPENSE ||
    investmentCategory === "INVESTMENT_NEGATIVE_RETURN";

  if (isPositive) {
    return {
      color: "text-primary",
      prefix: "+",
    };
  }

  if (isNegative) {
    return {
      color: "text-red-500",
      prefix: "-",
    };
  }

  return {
    color: "text-white",
    prefix: "",
  };
};

type AmountTextProps = {
  transaction: Transaction;
};

const AmountText = ({ transaction }: AmountTextProps) => {
  if (!transaction) return "";

  const { color, prefix } = getColorAndPrefix(transaction);

  return (
    <p className={`text-sm font-bold ${color}`}>
      {prefix}
      {formatCurrency(Number(transaction.amount))}
    </p>
  );
};

export default AmountText;
