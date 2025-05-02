import { Badge } from "@shadcn/badge";
import { TransactionType } from "@prisma/client";
import Icon from "@atoms/Icon";

interface TransactionTypeBadgeProps {
  type: TransactionType;
}

const TransactionTypeBadge = ({ type }: TransactionTypeBadgeProps) => {
  if (type === TransactionType.GAIN) {
    return (
      <Badge className="bg-muted font-bold text-primary hover:bg-muted">
        <Icon name="Circle" className="mr-2 fill-primary" size={10} />
        Ganho
      </Badge>
    );
  }

  if (type === TransactionType.EXPENSE) {
    return (
      <Badge className="bg-danger bg-opacity-10 font-bold text-danger hover:bg-danger hover:bg-opacity-10">
        <Icon name="Circle" className="mr-2 fill-danger" size={10} />
        Despesa
      </Badge>
    );
  }

  if (type === TransactionType.TRANSFER) {
    return (
      <Badge className="bg-white bg-opacity-10 font-bold text-white hover:bg-white hover:bg-opacity-10">
        <Icon name="Circle" className="mr-2 fill-white" size={10} />
        Transferência
      </Badge>
    );
  }

  if (type === TransactionType.INVESTMENT) {
    return (
      <Badge className="bg-yellow-300 bg-opacity-10 font-bold text-yellow-300 hover:bg-yellow-300 hover:bg-opacity-10">
        <Icon name="Circle" className="mr-2 fill-yellow-300" size={10} />
        Investimento
      </Badge>
    );
  }
};

export default TransactionTypeBadge;
