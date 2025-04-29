"use client";

import CreditCardUnity from "../../_components/CreditCardUnity";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shadcn/tabs";
import InvoiceList from "./InvoiceList";
import { Card } from "@shadcn/card";
import { INVOICE_STATUS_LABELS } from "@constants/creditCard";
import { MONTH_NAMES } from "@constants/month";
import InvoiceTransactions from "./InvoiceTransactions";
import {
  CreditCard,
  Invoice,
  InvoiceStatus,
  Transaction,
} from "@prisma/client";
import { useCallback, useMemo, useRef, useState } from "react";
import { ScrollArea } from "@shadcn/scroll-area";
import useIsDesktop from "@utils/useIsDesktop";

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
  const isDesktop = useIsDesktop();

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

  const transactionsRef = useRef<HTMLDivElement | null>(null);

  // Gets the transactions in the selected invoice
  const selectedInvoiceTransactions = useMemo(() => {
    if (selectedInvoiceId) {
      return transactionsByInvoice.find(
        (invoice) => invoice.id === selectedInvoiceId,
      )?.transactions;
    }
    return undefined;
  }, [selectedInvoiceId, transactionsByInvoice]);

  const selectedInvoiceName = useMemo(() => {
    if (!selectedInvoiceId) return;

    const invoice = invoices.find(
      (invoice) => invoice.id === selectedInvoiceId,
    );
    if (!invoice) return;

    return `${MONTH_NAMES[invoice.month]}/${invoice.year.toString().slice(-2)}`;
  }, [invoices, selectedInvoiceId]);

  // Gets the status of the selected invoice
  const selectedInvoiceStatus = useMemo(() => {
    if (selectedInvoiceId) {
      return invoices.find((invoice) => invoice.id === selectedInvoiceId)
        ?.status;
    }
    return undefined;
  }, [invoices, selectedInvoiceId]);

  // Function to handle invoice selection, updating the state
  const onSelectInvoice = useCallback(
    (invoiceId: string) => {
      setSelectedInvoiceId(invoiceId);

      if (!isDesktop && transactionsRef.current) {
        transactionsRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    },
    [isDesktop],
  );

  return (
    <div className="flex flex-col gap-6 md:h-full md:flex-row md:gap-10">
      {/* Left section */}
      <div className="flex h-full max-h-[700px] min-h-[500px] w-full flex-col space-y-6 md:max-h-full md:w-1/2">
        {/* Card */}
        <div className="flex items-center justify-center">
          <CreditCardUnity
            creditCard={creditCard}
            complete={false}
            userName={userName}
          />
        </div>

        {/* Tabs */}
        <Card className="flex flex-1 flex-col overflow-hidden">
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
            {(["PAID", "CLOSED", "OPEN"] as InvoiceStatus[]).map((status) => (
              <TabsContent key={status} value={status} className="h-0 flex-1">
                <ScrollArea className="h-full">
                  <InvoiceList
                    invoices={getFilteredInvoices(status)}
                    onSelectInvoice={onSelectInvoice}
                    selectedInvoiceId={selectedInvoiceId}
                  />
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </Card>
      </div>

      {/* Right side */}
      <div
        ref={transactionsRef}
        className="flex max-h-[700px] min-h-[250px] w-full flex-col overflow-hidden md:h-full md:max-h-full md:w-1/2"
      >
        <InvoiceTransactions
          transactions={selectedInvoiceTransactions}
          canChangeTransactions={selectedInvoiceStatus !== "PAID"}
          invoiceName={selectedInvoiceName}
        />
      </div>
    </div>
  );
};

export default InvoiceDetails;
