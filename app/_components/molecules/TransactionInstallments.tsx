import { Transaction } from "@prisma/client";
import ShouldRender from "@atoms/ShouldRender";

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
      <p className="mt-auto min-w-[28.3px] text-sm text-muted-foreground">
        {`${transaction.installmentNumber} / ${transaction.installmentsTotal}`}
      </p>
    </ShouldRender>
  );
};

export default TransactionInstallments;
