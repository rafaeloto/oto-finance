import { Transaction } from "@prisma/client";
import ShouldRender from "../_atoms/should-render";

type TransactionInstallmentsProps = {
  transaction: Transaction;
};

const TransactionInstallments = ({
  transaction,
}: TransactionInstallmentsProps) => {
  return (
    <ShouldRender
      if={!!transaction.installmentId && !!transaction.installmentsTotal}
    >
      <p className="mt-auto text-sm text-muted-foreground">
        {`${transaction.installmentNumber} / ${transaction.installmentsTotal}`}
      </p>
    </ShouldRender>
  );
};

export default TransactionInstallments;
