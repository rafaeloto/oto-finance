import { Badge } from "@/app/_components/ui/badge";
import { Transaction, TransactionType } from "@prisma/client";
import { CircleIcon } from "lucide-react";

interface TransactionTypeBadgeProps {
  transaction: Transaction;
}

const TransactionTypeBadge = ({ transaction }: TransactionTypeBadgeProps) => {
  if (transaction.type === TransactionType.GAIN) {
    return (
      <Badge className="bg-muted font-bold text-primary hover:bg-muted">
        <CircleIcon className="mr-2 fill-primary" size={10} />
        Ganho
      </Badge>
    );
  }

  if (transaction.type === TransactionType.EXPENSE) {
    return (
      <Badge className="bg-danger bg-opacity-10 font-bold text-danger hover:bg-danger hover:bg-opacity-10">
        <CircleIcon className="mr-2 fill-danger" size={10} />
        Despesa
      </Badge>
    );
  }

  if (transaction.type === TransactionType.TRANSFER) {
    return (
      <Badge className="bg-white bg-opacity-10 font-bold text-white hover:bg-white hover:bg-opacity-10">
        <CircleIcon className="mr-2 fill-white" size={10} />
        Transferência
      </Badge>
    );
  }

  if (transaction.type === TransactionType.INVESTMENT) {
    return (
      <Badge className="bg-yellow-300 bg-opacity-10 font-bold text-yellow-300 hover:bg-yellow-300 hover:bg-opacity-10">
        <CircleIcon className="mr-2 fill-yellow-300" size={10} />
        Investimento
      </Badge>
    );
  }
};

export default TransactionTypeBadge;
