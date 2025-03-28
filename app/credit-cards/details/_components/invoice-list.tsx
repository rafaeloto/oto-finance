"use client";

import EmptyListFeedback from "@/app/_components/_atoms/empty-list-feedback";
import { INVOICE_STATUS_LABELS } from "@/app/_constants/credit-card";
import { formatCurrency } from "@/app/_utils/currency";
import { Invoice } from "@prisma/client";
import clsx from "clsx";
import InvoiceButtons from "./invoice-buttons";

type params = {
  invoices: Invoice[];
  onSelectInvoice: (id: string) => void;
  selectedInvoiceId?: string;
};

const InvoiceList = ({
  invoices,
  onSelectInvoice,
  selectedInvoiceId,
}: params) => {
  if (invoices.length === 0) {
    return <EmptyListFeedback message="Nenhuma fatura encontrada" />;
  }

  const statusColorMap = {
    OPEN: "text-yellow-400",
    PAID: "text-green-500",
    CLOSED: "text-red-500",
  };

  return (
    <div className="flex flex-col space-y-4 p-4">
      {invoices.map((invoice) => (
        <div
          key={invoice.id}
          className={clsx(
            "rounded-md border p-4 px-6 shadow-sm",
            invoice.id === selectedInvoiceId &&
              "border-muted-foreground bg-muted",
          )}
        >
          <div className="flex w-full items-center justify-between">
            <p className="w-1/4 text-lg font-medium">
              {invoice.month}/{invoice.year}
            </p>
            <p className={`w-1/4 ${statusColorMap[invoice.status]} font-bold`}>
              {INVOICE_STATUS_LABELS[invoice.status]}
            </p>
            <p className="w-1/4 text-lg font-semibold">
              {formatCurrency(Number(invoice.totalAmount))}
            </p>
            <InvoiceButtons
              onClickSee={() => onSelectInvoice(invoice.id)}
              canBePaid={invoice.status === "CLOSED"}
              invoice={invoice}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default InvoiceList;
