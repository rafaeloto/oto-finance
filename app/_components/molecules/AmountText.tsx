import { formatCurrency } from "@utils/currency";
import { Transaction, TransactionType } from "@prisma/client";
import { NEGATIVE_RETURN_ID, POSITIVE_RETURN_ID } from "@constants/category";

const getColorAndPrefix = (transaction: Transaction) => {
  const { type, categoryId } = transaction;

  const isPositive =
    type === TransactionType.GAIN || categoryId === POSITIVE_RETURN_ID;
  const isNegative =
    type === TransactionType.EXPENSE || categoryId === NEGATIVE_RETURN_ID;

  if (isPositive) {
    return {
      color: "text-primary",
      prefix: "+",
    };
  }

  if (isNegative) {
    return {
      color: "text-danger",
      prefix: "-",
    };
  }

  return {
    color: "",
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
