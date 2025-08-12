import EmptyListFeedback from "@atoms/EmptyListFeedback";
import AmountText from "@molecules/AmountText";
import TransactionInstallments from "@molecules/TransactionInstallments";
import { Button } from "@shadcn/button";
import { CardContent, CardHeader, CardTitle } from "@shadcn/card";
import { ScrollArea } from "@shadcn/scroll-area";
import { TRANSACTION_PAYMENT_METHOD_ICONS } from "@constants/transaction";
import { Transaction } from "@prisma/client";
import Link from "@atoms/Link";
import Icon, { type LucideIconName } from "@atoms/Icon";

interface LastTransactionsProps {
  lastTransactions: Transaction[];
}

const LastTransactions = ({ lastTransactions }: LastTransactionsProps) => {
  const hasNoData = lastTransactions.length === 0;

  return (
    <div className="flex max-h-[700px] flex-col rounded-md border md:max-h-none md:min-h-0 md:flex-1">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="font-bold">Últimas Transações</CardTitle>
        <Button variant="outline" className="rounded-full font-bold" asChild>
          <Link href="/transactions">Ver mais</Link>
        </Button>
      </CardHeader>

      <ScrollArea className="min-h-0 flex-1 overflow-auto">
        {hasNoData ? (
          <EmptyListFeedback message="Nenhuma transação registrada" />
        ) : (
          <CardContent className="space-y-6 px-3 md:px-6">
            {lastTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between gap-3 md:gap-0"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-muted p-3">
                    <Icon
                      name={
                        TRANSACTION_PAYMENT_METHOD_ICONS[
                          transaction.paymentMethod
                        ] as LucideIconName
                      }
                      size={20}
                      opacity={0.7}
                    />
                  </div>
                  <div className="md:min-w-none flex min-w-0 flex-1 flex-col md:flex-none">
                    <div className="md:min-w-none flex min-w-0 gap-3">
                      <p className="md:min-w-none min-w-0 truncate text-sm font-bold md:whitespace-normal">
                        {transaction.name}
                      </p>
                      <TransactionInstallments transaction={transaction} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="w-20 md:w-auto">
                  <AmountText transaction={transaction} />
                </div>
              </div>
            ))}
          </CardContent>
        )}
      </ScrollArea>
    </div>
  );
};

export default LastTransactions;
