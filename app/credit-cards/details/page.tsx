import EmptyListFeedback from "@atoms/EmptyListFeedback";
import Navbar from "@molecules/Navbar";
import { getCreditCardById } from "@data/getCreditCardById";
import { getInvoices } from "@data/getInvoices";
import { getTransactions } from "@data/getTransactions";
import InvoiceDetails from "./_components/invoice-details";
import { getUser } from "@data/getUser";

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

      <div className="flex h-dvh flex-col overflow-hidden p-6 md:px-20 md:py-10">
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
