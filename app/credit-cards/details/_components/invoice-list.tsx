import EmptyListFeedback from "@/app/_components/empty-list-feedback";
import { INVOICE_STATUS_LABELS } from "@/app/_constants/credit-card";
import { formatCurrency } from "@/app/_utils/currency";
import { Invoice } from "@prisma/client";

type params = {
  invoices: Invoice[];
};

const InvoiceList = ({ invoices }: params) => {
  if (invoices.length === 0) {
    return <EmptyListFeedback message="Nenhuma fatura encontrada" />;
  }

  return (
    <div className="h-full space-y-4 pt-4">
      {invoices.map((invoice) => (
        <div
          key={invoice.id}
          className="flex items-center justify-between rounded-md border p-4 shadow-sm"
        >
          <div>
            <p className="text-sm font-medium">
              {invoice.month}/{invoice.year}
            </p>
            <p className="text-xs text-gray-500">
              Status: {INVOICE_STATUS_LABELS[invoice.status]}
            </p>
          </div>
          <p className="text-sm font-semibold text-green-500">
            {formatCurrency(Number(invoice.totalAmount))}
          </p>
        </div>
      ))}
    </div>
  );
};

export default InvoiceList;
