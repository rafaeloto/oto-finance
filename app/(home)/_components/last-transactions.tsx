import EmptyListFeedback from "@/app/_components/_atoms/empty-list-feedback";
import AmountText from "@/app/_components/_molecules/AmountText";
import { Button } from "@/app/_components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { TRANSACTION_PAYMENT_METHOD_ICONS } from "@/app/_constants/transaction";
import { Transaction } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

interface LastTransactionsProps {
  lastTransactions: Transaction[];
}

const LastTransactions = ({ lastTransactions }: LastTransactionsProps) => {
  const hasNoData = lastTransactions.length === 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col rounded-md border">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="font-bold">Últimas Transações</CardTitle>
        <Button variant="outline" className="rounded-full font-bold" asChild>
          <Link href="/transactions">Ver mais</Link>
        </Button>
      </CardHeader>

      <ScrollArea className="min-h-0 flex-1 overflow-auto">
        {hasNoData ? (
          <EmptyListFeedback message="Nenhuma transação registrada" />
        ) : (
          <CardContent className="space-y-6">
            {lastTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-white bg-opacity-[3%] p-3 text-white">
                    <Image
                      src={`/${TRANSACTION_PAYMENT_METHOD_ICONS[transaction.paymentMethod]}`}
                      height={20}
                      width={20}
                      alt={transaction.paymentMethod}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{transaction.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <AmountText transaction={transaction} />
              </div>
            ))}
          </CardContent>
        )}
      </ScrollArea>
    </div>
  );
};

export default LastTransactions;
