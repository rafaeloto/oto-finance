"use client";

import EmptyListFeedback from "@atoms/EmptyListFeedback";
import { Card, CardContent, CardHeader, CardTitle } from "@shadcn/card";
import { ScrollArea } from "@shadcn/scroll-area";
import { TRANSACTION_PAYMENT_METHOD_ICONS } from "@constants/transaction";
import { MONTH_NAMES } from "@constants/month";
import { formatCurrency } from "@utils/currency";
import EditTransactionButton from "@components/transaction/EditTransactionButton";
import DeleteTransactionButton from "@components/transaction/DeleteTransactionButton";
import { Invoice, Transaction } from "@prisma/client";
import Image from "next/image";
import ShouldRender from "@atoms/ShouldRender";
import useIsDesktop from "@utils/useIsDesktop";
import TransactionInstallments from "@molecules/TransactionInstallments";
import AddTransactionButton from "@components/transaction/AddTransactionButton";

export type TransactionsByInvoice = {
  id: string;
  transactions: Transaction[];
}[];

type InvoiceTransactionsProps = {
  transactionsByInvoice: TransactionsByInvoice;
  selectedInvoice: Invoice | undefined;
  canUserAddTransaction: boolean;
};

const InvoiceTransactions = ({
  transactionsByInvoice,
  selectedInvoice,
  canUserAddTransaction,
}: InvoiceTransactionsProps) => {
  const isDesktop = useIsDesktop();

  if (!selectedInvoice) {
    return (
      <Card className="flex h-full flex-col space-y-4">
        <CardHeader className="bg-muted">
          <CardTitle className="font-bold">Transações da Fatura</CardTitle>
        </CardHeader>
        <EmptyListFeedback message="Nenhuma fatura selecionada" />
      </Card>
    );
  }

  const invoiceTransactions = transactionsByInvoice.find(
    (invoice) => invoice.id === selectedInvoice.id,
  )?.transactions;
  const hasNoTransactions = !invoiceTransactions?.length;
  const invoiceName = `${MONTH_NAMES[selectedInvoice.month]}/${selectedInvoice.year.toString().slice(-2)}`;
  const canChangeTransactions = selectedInvoice.status !== "PAID";

  return (
    <Card className="flex h-full flex-col space-y-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-muted px-3 pb-4 md:px-6 md:pb-6">
        <div className="flex flex-col items-start gap-2 md:flex-row md:items-baseline md:gap-3">
          <CardTitle className="text-xl font-bold md:text-2xl">
            Transações da Fatura
          </CardTitle>
          <ShouldRender if={!!invoiceName}>
            <ShouldRender if={isDesktop}>-</ShouldRender>
            <p className="text-lg text-muted-foreground md:text-xl">
              {invoiceName}
            </p>
          </ShouldRender>
        </div>
        <AddTransactionButton
          canUserAddTransaction={canUserAddTransaction}
          short={!isDesktop}
        />
      </CardHeader>

      {hasNoTransactions ? (
        <EmptyListFeedback message="Nenhuma transação na fatura" />
      ) : (
        <ScrollArea className="flex-1">
          <CardContent className="space-y-6 px-3 py-0 md:px-6">
            {invoiceTransactions.map((transaction) => (
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
