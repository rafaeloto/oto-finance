import EmptyListFeedback from "@/app/_components/_atoms/empty-list-feedback";
import Navbar from "@/app/_components/_molecules/navbar";
import { getCreditCardById } from "@/app/_data/get-credit-card-by-id";
import { getInvoices } from "@/app/_data/get-invoices";
import { getTransactions } from "@/app/_data/get-transactions";
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

  // Gets all invoices from the credit card
  const invoices = await getInvoices({ creditCardId: id });

  // Gets all invoice ids
  const invoiceIds = invoices.map((invoice) => invoice.id);

  // Creates an array of objects with the invoice id and its transactions
  const transactionsByInvoice = await Promise.all(
    invoiceIds.map(async (invoiceId) => ({
      id: invoiceId,
      transactions: await getTransactions({ invoiceId }),
    })),
  );

  const { fullName: userName } = await getUser();

  return (
    <>
      <Navbar />

      <div className="flex h-full flex-col overflow-hidden px-20 py-10">
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
