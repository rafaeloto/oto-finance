"use client";

import EmptyListFeedback from "@/app/_components/empty-list-feedback";
import { INVOICE_STATUS_LABELS } from "@/app/_constants/credit-card";
import { formatCurrency } from "@/app/_utils/currency";
import { Invoice } from "@prisma/client";
import clsx from "clsx";

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
    OPEN: "yellow-400",
    PAID: "green-500",
    CLOSED: "red-500",
  };

  return (
    <div className="h-full space-y-4 pt-4">
      {invoices.map((invoice) => (
        <div
          key={invoice.id}
          className={clsx(
            "flex cursor-pointer items-center justify-between rounded-md border p-4 shadow-sm",
            invoice.id === selectedInvoiceId &&
              "border-muted-foreground bg-muted",
          )}
          onClick={() => onSelectInvoice(invoice.id)}
        >
          <p className="min-w-[20%] text-lg font-medium">
            {invoice.month}/{invoice.year}
          </p>
          <p className={`text-${statusColorMap[invoice.status]} font-bold`}>
            {INVOICE_STATUS_LABELS[invoice.status]}
          </p>
          <p className="min-w-[20%] text-lg font-semibold">
            {formatCurrency(Number(invoice.totalAmount))}
          </p>
        </div>
      ))}
    </div>
  );
};

export default InvoiceList;
