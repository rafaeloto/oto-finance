import { formatCurrency } from "@/app/_utils/currency";
import { Transaction, TransactionType } from "@prisma/client";

const getAmountColor = (type: TransactionType) => {
  if (type === TransactionType.EXPENSE) {
    return "text-red-500";
  }
  if (type === TransactionType.GAIN) {
    return "text-primary";
  }
  return "text-white";
};

const getAmountPrefix = (type: TransactionType) => {
  if (type === TransactionType.GAIN) {
    return "+";
  }
  return "-";
};

type AmountTextProps = {
  transaction: Transaction;
};

const AmountText = ({ transaction }: AmountTextProps) => {
  if (!transaction) return "";

  return (
    <p className={`text-sm font-bold ${getAmountColor(transaction.type)}`}>
      {getAmountPrefix(transaction.type)}
      {formatCurrency(Number(transaction.amount))}
    </p>
  );
};

export default AmountText;
