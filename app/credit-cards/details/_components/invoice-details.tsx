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
import { ScrollArea } from "@/app/_components/ui/scroll-area";

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

  // Function to filter invoices by status and sort them
  const getFilteredInvoices = useCallback(
    (status: InvoiceStatus) =>
      invoices
        .filter((invoice) => invoice.status === status)
        .sort((a, b) => {
          if (a.year === b.year) {
            return a.month - b.month;
          }
          return a.year - b.year;
        }),
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
    <div className="flex h-full gap-10">
      {/* Left section */}
      <div className="flex h-full w-1/2 flex-col space-y-6">
        {/* Card */}
        <CreditCardUnity
          creditCard={creditCard}
          complete={false}
          userName={userName}
        />

        {/* Tabs */}
        <Card className="flex h-full flex-1 flex-col overflow-hidden">
          <Tabs
            defaultValue="OPEN"
            className="flex h-full w-full flex-1 flex-col"
          >
            <TabsList className="flex h-14 justify-between px-10">
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

            {/* Tabs Content */}
            <TabsContent value="PAID" className="h-0 flex-1">
              <ScrollArea className="h-full">
                <InvoiceList
                  invoices={getFilteredInvoices("PAID")}
                  onSelectInvoice={onSelectInvoice}
                  selectedInvoiceId={selectedInvoiceId}
                />
              </ScrollArea>
            </TabsContent>
            <TabsContent value="CLOSED" className="h-0 flex-1">
              <ScrollArea className="h-full">
                <InvoiceList
                  invoices={getFilteredInvoices("CLOSED")}
                  onSelectInvoice={onSelectInvoice}
                  selectedInvoiceId={selectedInvoiceId}
                />
              </ScrollArea>
            </TabsContent>
            <TabsContent value="OPEN" className="h-0 flex-1">
              <ScrollArea className="h-full">
                <InvoiceList
                  invoices={getFilteredInvoices("OPEN")}
                  onSelectInvoice={onSelectInvoice}
                  selectedInvoiceId={selectedInvoiceId}
                />
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Right side */}
      <div className="flex h-full w-1/2 flex-col overflow-hidden">
        <InvoiceTransactions
          transactions={selectedInvoiceTransactions}
          canChangeTransactions={selectedInvoiceStatus !== "PAID"}
        />
      </div>
    </div>
  );
};

export default InvoiceDetails;
