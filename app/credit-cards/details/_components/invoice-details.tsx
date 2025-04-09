"use client";

import CreditCardUnity from "../../_components/credit-card-unity";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shadcn/tabs";
import InvoiceList from "./invoice-list";
import { Card } from "@shadcn/card";
import { INVOICE_STATUS_LABELS } from "@constants/creditCard";
import InvoiceTransactions from "./invoice-transactions";
import {
  CreditCard,
  Invoice,
  InvoiceStatus,
  Transaction,
} from "@prisma/client";
import { useCallback, useMemo, useState } from "react";
import { ScrollArea } from "@shadcn/scroll-area";
import { Label } from "@shadcn/label";
import { Switch } from "@shadcn/switch";
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
  const [showTransactions, setShowTransactions] = useState(false);

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
    setShowTransactions(true);
  }, []);

  return (
    <div className="flex h-full flex-col gap-6 md:flex-row md:gap-10">
      {/* Left section */}
      <div
        className={`flex ${(isDesktop || !showTransactions) && "h-full"} w-full flex-col space-y-6 md:w-1/2`}
      >
        {/* Card */}
        <div className="flex items-center justify-center">
          <CreditCardUnity
            creditCard={creditCard}
            complete={false}
            userName={userName}
          />
        </div>

        {/* Switch para mobile */}
        <div className="flex items-center justify-center gap-3 md:hidden">
          <Label>Faturas</Label>
          <Switch
            checked={showTransactions}
            onCheckedChange={setShowTransactions}
          />
          <Label>Transações</Label>
        </div>

        {/* Tabs */}
        {(isDesktop || !showTransactions) && (
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
        )}
      </div>

      {/* Right side */}
      {(isDesktop || showTransactions) && (
        <div className="flex h-full w-full flex-col overflow-hidden md:w-1/2">
          <InvoiceTransactions
            transactions={selectedInvoiceTransactions}
            canChangeTransactions={selectedInvoiceStatus !== "PAID"}
          />
        </div>
      )}
    </div>
  );
};

export default InvoiceDetails;
