"use client";

import CreditCardUnity from "../../_components/CreditCardUnity";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shadcn/tabs";
import InvoiceList from "./InvoiceList";
import { Card } from "@shadcn/card";
import { INVOICE_STATUS_LABELS } from "@constants/creditCard";
import InvoiceTransactions, {
  type TransactionsByInvoice,
} from "./InvoiceTransactions";
import { CreditCard, Invoice, InvoiceStatus } from "@prisma/client";
import { useCallback, useMemo, useRef, useState } from "react";
import { ScrollArea } from "@shadcn/scroll-area";
import useIsDesktop from "@utils/useIsDesktop";

type InvoiceDetailsProps = {
  creditCard: CreditCard;
  invoices: Invoice[];
  transactionsByInvoice: TransactionsByInvoice;
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

  const selectedInvoice = useMemo(() => {
    if (!selectedInvoiceId) return;

    return invoices.find((invoice) => invoice.id === selectedInvoiceId);
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
          transactionsByInvoice={transactionsByInvoice}
          invoice={selectedInvoice}
        />
      </div>
    </div>
  );
};

export default InvoiceDetails;
