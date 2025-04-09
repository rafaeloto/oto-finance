"use client";

import EmptyListFeedback from "@atoms/EmptyListFeedback";
import { INVOICE_STATUS_LABELS } from "@constants/creditCard";
import { formatCurrency } from "@utils/currency";
import { Invoice } from "@prisma/client";
import clsx from "clsx";
import InvoiceButtons from "./invoice-buttons";
import useIsDesktop from "@utils/useIsDesktop";

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
  const isDesktop = useIsDesktop();

  if (invoices.length === 0) {
    return <EmptyListFeedback message="Nenhuma fatura encontrada" />;
  }

  const statusColorMap = {
    OPEN: "text-yellow-400",
    PAID: "text-green-500",
    CLOSED: "text-red-500",
  };

  return (
    <div className="flex flex-col space-y-4 pt-4 md:px-4 md:py-4">
      {invoices.map((invoice) => (
        <div
          key={invoice.id}
          className={clsx(
            "rounded-md border p-4 shadow-sm md:px-6",
            invoice.id === selectedInvoiceId &&
              "border-muted-foreground bg-muted",
          )}
        >
          <div className="flex w-full items-center justify-between">
            <p className="w-1/8 text-sm font-medium md:w-1/4 md:text-lg">
              {invoice.month}/{invoice.year}
            </p>
            <p
              className={`w-1/8 text-sm md:w-1/4 md:text-base ${statusColorMap[invoice.status]} font-bold`}
            >
              {INVOICE_STATUS_LABELS[invoice.status]}
            </p>
            <p className="w-1/4 text-sm font-semibold md:text-lg">
              {formatCurrency(Number(invoice.totalAmount))}
            </p>
            <InvoiceButtons
              onClickSee={() => onSelectInvoice(invoice.id)}
              canBePaid={invoice.status === "CLOSED"}
              invoice={invoice}
              noPadding={!isDesktop}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default InvoiceList;
