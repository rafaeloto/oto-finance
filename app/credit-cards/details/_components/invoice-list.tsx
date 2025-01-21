"use client";

import EmptyListFeedback from "@/app/_components/empty-list-feedback";
import { formatCurrency } from "@/app/_utils/currency";
import { CreditCard, Invoice } from "@prisma/client";
import clsx from "clsx";

type params = {
  invoices: Invoice[];
  onSelectInvoice: (id: string) => void;
  creditCard: CreditCard;
  selectedInvoiceId?: string;
};

const InvoiceList = ({
  invoices,
  onSelectInvoice,
  creditCard,
  selectedInvoiceId,
}: params) => {
  if (invoices.length === 0) {
    return <EmptyListFeedback message="Nenhuma fatura encontrada" />;
  }

  return (
    <div className="h-full space-y-4 pt-4">
      {invoices.map((invoice) => (
        <div
          key={invoice.id}
          className={clsx(
            "flex cursor-pointer items-center justify-between rounded-md border p-4 shadow-sm",
            invoice.id === selectedInvoiceId && "border-green-700", // Estilo condicional
          )}
          onClick={() => onSelectInvoice(invoice.id)}
        >
          <p className="w-[10%] text-lg font-medium">
            {invoice.month}/{invoice.year}
          </p>
          <p className="text-sm">Dia de Fechamento: {creditCard.closingDate}</p>
          <p className="text-sm">Dia de Vencimento: {creditCard.dueDate}</p>
          <p className="w-[10%] text-lg font-semibold">
            {formatCurrency(Number(invoice.totalAmount))}
          </p>
        </div>
      ))}
    </div>
  );
};

export default InvoiceList;
