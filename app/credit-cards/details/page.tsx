import EmptyListFeedback from "@/app/_components/empty-list-feedback";
import Navbar from "@/app/_components/navbar";
import { getCreditCardById } from "@/app/_data/get-credit-card-by-id";
import { getInvoices } from "@/app/_data/get-invoices";
import { getTransactionsByInvoice } from "@/app/_data/get-transactions-by-invoice";
import InvoiceDetails from "./_components/invoice-details";
import { getUser } from "@/app/_data/get-user";

interface CardDetailsProps {
  searchParams: {
    id: string;
  };
}

const CreditCardDetails = async ({
  searchParams: { id },
}: CardDetailsProps) => {
  const creditCard = await getCreditCardById({ id });

  const foundCreditCard = !!creditCard;

  const invoices = await getInvoices({ creditCardId: id });

  const invoiceIds = invoices.map((invoice) => invoice.id);

  const transactionsByInvoice = await Promise.all(
    invoiceIds.map(async (invoiceId) => ({
      id: invoiceId,
      transactions: await getTransactionsByInvoice({ invoiceId }),
    })),
  );

  const { fullName: userName } = await getUser();

  return (
    <>
      <Navbar />

      <div className="flex h-screen flex-col space-y-6 overflow-hidden px-20 py-10">
        {!foundCreditCard ? (
          <EmptyListFeedback message="Cartão de crédito não encontrado" />
        ) : (
          <InvoiceDetails
            creditCard={creditCard}
            invoices={invoices}
            transactionsByInvoice={transactionsByInvoice}
            userName={userName || undefined}
          />
        )}
      </div>
    </>
  );
};

export default CreditCardDetails;
