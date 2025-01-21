"use client";

import EmptyListFeedback from "@/app/_components/empty-list-feedback";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { TRANSACTION_PAYMENT_METHOD_ICONS } from "@/app/_constants/transaction";
import { formatCurrency } from "@/app/_utils/currency";
import EditTransactionButton from "@/app/transactions/_components/edit-transaction-button";
import DeleteTransactionButton from "@/app/transactions/_components/delete-transaction-button";
import { Transaction } from "@prisma/client";
import Image from "next/image";
import ShouldRender from "@/app/_components/should-render";

type InvoiceTransactionsProps = {
  transactions: Transaction[] | undefined;
  canChangeTransactions: boolean;
};

const InvoiceTransactions = ({
  transactions,
  canChangeTransactions,
}: InvoiceTransactionsProps) => {
  const hasNoData = !transactions?.length;

  return (
    <Card className="space-y-4">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="font-bold">Transações da Fatura</CardTitle>
      </CardHeader>

      {hasNoData ? (
        <EmptyListFeedback message="Nenhuma transação na fatura" />
      ) : (
        <ScrollArea>
          <CardContent className="space-y-6">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="border-b-1 flex items-center justify-between border-b pb-4"
              >
                <div className="flex w-[20%] items-center gap-3">
                  <div className="rounded-lg bg-white bg-opacity-[3%] p-3 text-white">
                    <Image
                      src={`/${TRANSACTION_PAYMENT_METHOD_ICONS[transaction.paymentMethod]}`}
                      height={20}
                      width={20}
                      alt={transaction.paymentMethod}
                    />
                  </div>
                  <p className="text-sm font-bold">{transaction.name}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(transaction.date).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p className="text-sm font-bold">
                  {formatCurrency(Number(transaction.amount))}
                </p>

                <ShouldRender if={canChangeTransactions}>
                  <div className="space-x-1">
                    <EditTransactionButton transaction={transaction} />
                    <DeleteTransactionButton transactionId={transaction.id} />
                  </div>
                </ShouldRender>
              </div>
            ))}
          </CardContent>
        </ScrollArea>
      )}
    </Card>
  );
};

export default InvoiceTransactions;
