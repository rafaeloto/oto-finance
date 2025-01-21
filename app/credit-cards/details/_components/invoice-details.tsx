"use client";

import CreditCardUnity from "../../_components/credit-card-unity";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/_components/ui/tabs";
import InvoiceList from "./invoice-list";
import { Card } from "@/app/_components/ui/card";
import { INVOICE_STATUS_LABELS } from "@/app/_constants/credit-card";
import InvoiceTransactions from "./invoice-transactions";
import {
  CreditCard,
  Invoice,
  InvoiceStatus,
  Transaction,
} from "@prisma/client";
import { useCallback, useMemo, useState } from "react";

type InvoiceDetailsProps = {
  creditCard: CreditCard;
  invoices: Invoice[];
  transactionsByInvoice: {
    id: string;
    transactions: Transaction[];
  }[];
  userName?: string;
};

const InvoiceDetails = (props: InvoiceDetailsProps) => {
  const { creditCard, invoices, transactionsByInvoice, userName } = props;

  // Function to filter invoices by status
  const getFilteredInvoices = useCallback(
    (status: InvoiceStatus) =>
      invoices.filter((invoice) => invoice.status === status),
    [invoices],
  );

  const [selectedInvoiceId, setSelectedInvoiceId] = useState<
    string | undefined
  >(getFilteredInvoices("OPEN")[0]?.id);

  // Gets the transactions in the selected invoice
  const selectedInvoiceTransactions = useMemo(() => {
    if (selectedInvoiceId) {
      return transactionsByInvoice.find(
        (invoice) => invoice.id === selectedInvoiceId,
      )?.transactions;
    }
    return undefined;
  }, [selectedInvoiceId, transactionsByInvoice]);

  // Gets the transactions in the selected invoice
  const selectedInvoiceStatus = useMemo(() => {
    if (selectedInvoiceId) {
      return invoices.find((invoice) => invoice.id === selectedInvoiceId)
        ?.status;
    }
    return undefined;
  }, [invoices, selectedInvoiceId]);

  // Function to handle invoice selection, updating the state
  const onSelectInvoice = useCallback((invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
  }, []);

  return (
    <div className="grid h-full grid-cols-2 gap-6">
      {/* Parte esquerda */}
      <div className="flex flex-col space-y-6">
        {/* Cartão */}
        <CreditCardUnity
          creditCard={creditCard}
          complete={false}
          userName={userName}
        />

        {/* Tabs */}
        <Card className="h-full">
          <Tabs defaultValue="OPEN" className="h-full w-full">
            <TabsList className="h-[10%] w-full justify-between px-10">
              <TabsTrigger value="PAID">
                {INVOICE_STATUS_LABELS.PAID}
              </TabsTrigger>
              <TabsTrigger value="CLOSED">
                {INVOICE_STATUS_LABELS.CLOSED}
              </TabsTrigger>
              <TabsTrigger value="OPEN">
                {INVOICE_STATUS_LABELS.OPEN}
              </TabsTrigger>
            </TabsList>

            {/* Conteúdo das tabs */}
            <TabsContent value="PAID" className="m-0 h-[90%]">
              <InvoiceList
                invoices={getFilteredInvoices("PAID")}
                onSelectInvoice={onSelectInvoice}
                selectedInvoiceId={selectedInvoiceId}
              />
            </TabsContent>
            <TabsContent value="CLOSED" className="m-0 h-[90%]">
              <InvoiceList
                invoices={getFilteredInvoices("CLOSED")}
                onSelectInvoice={onSelectInvoice}
                selectedInvoiceId={selectedInvoiceId}
              />
            </TabsContent>
            <TabsContent value="OPEN" className="m-0 h-[90%]">
              <InvoiceList
                invoices={getFilteredInvoices("OPEN")}
                onSelectInvoice={onSelectInvoice}
                selectedInvoiceId={selectedInvoiceId}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Parte direita */}
      <InvoiceTransactions
        transactions={selectedInvoiceTransactions}
        canChangeTransactions={selectedInvoiceStatus !== "PAID"}
      />
    </div>
  );
};

export default InvoiceDetails;
