"use client";

import EmptyListFeedback from "@atoms/EmptyListFeedback";
import { Card, CardContent, CardHeader, CardTitle } from "@shadcn/card";
import { ScrollArea } from "@shadcn/scroll-area";
import { TRANSACTION_PAYMENT_METHOD_ICONS } from "@constants/transaction";
import { formatCurrency } from "@utils/currency";
import EditTransactionButton from "@components/transaction/EditTransactionButton";
import DeleteTransactionButton from "@components/transaction/DeleteTransactionButton";
import { Transaction } from "@prisma/client";
import Image from "next/image";
import ShouldRender from "@atoms/ShouldRender";
import useIsDesktop from "@utils/useIsDesktop";
import TransactionInstallments from "@molecules/TransactionInstallments";

type InvoiceTransactionsProps = {
  transactions: Transaction[] | undefined;
  canChangeTransactions: boolean;
  invoiceName?: string;
};

const InvoiceTransactions = ({
  transactions,
  canChangeTransactions,
  invoiceName,
}: InvoiceTransactionsProps) => {
  const hasNoData = !transactions?.length;
  const isDesktop = useIsDesktop();

  return (
    <Card className="flex h-full flex-col space-y-4">
      <CardHeader className="flex items-start gap-2 space-y-0 px-3 md:flex-row md:items-baseline md:gap-3 md:px-6">
        <CardTitle className="font-bold">Transações da Fatura</CardTitle>
        <ShouldRender if={!!invoiceName}>
          <ShouldRender if={isDesktop}>-</ShouldRender>
          <p className="text-lg text-muted-foreground md:text-xl">
            {invoiceName}
          </p>
        </ShouldRender>
      </CardHeader>

      {hasNoData ? (
        <EmptyListFeedback message="Nenhuma transação na fatura" />
      ) : (
        <ScrollArea className="flex-1">
          <CardContent className="space-y-6 px-3 py-0 md:px-6">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="border-b-1 flex items-center justify-between border-b pb-4"
              >
                <div className="flex w-[35%] items-center gap-3 md:w-[45%]">
                  <ShouldRender if={isDesktop}>
                    <div className="rounded-lg bg-white bg-opacity-[3%] p-3 text-white">
                      <Image
                        src={`/${TRANSACTION_PAYMENT_METHOD_ICONS[transaction.paymentMethod]}`}
                        height={20}
                        width={20}
                        alt={transaction.paymentMethod}
                      />
                    </div>
                  </ShouldRender>
                  <div className="flex gap-3">
                    <p className="text-sm font-bold md:text-base">
                      {transaction.name}
                    </p>
                    <TransactionInstallments transaction={transaction} />
                  </div>
                </div>

                <p className="w-10 text-sm text-muted-foreground md:w-20 md:text-base">
                  {new Date(transaction.date).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    ...(isDesktop && { year: "2-digit" }),
                  })}
                </p>
                <p className="w-20 text-sm font-bold md:w-24 md:text-lg">
                  {formatCurrency(Number(transaction.amount))}
                </p>

                <ShouldRender if={canChangeTransactions}>
                  <div className="space-x-3 md:space-x-1">
                    <EditTransactionButton
                      transaction={transaction}
                      noPadding={!isDesktop}
                    />
                    <DeleteTransactionButton
                      transactionId={transaction.id}
                      noPadding={!isDesktop}
                    />
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
