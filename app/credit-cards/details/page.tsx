import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import EmptyListFeedback from "@atoms/EmptyListFeedback";
import Navbar from "@molecules/Navbar";
import { getCreditCardById } from "@data/getCreditCardById";
import { getInvoices } from "@data/getInvoices";
import { getTransactions } from "@data/getTransactions";
import InvoiceDetails from "./_components/InvoiceDetails";
import { getUser } from "@data/getUser";
import { getCanUserAddTransaction } from "@data/getCanUserAddTransaction";

interface CardDetailsProps {
  searchParams: {
    id: string;
  };
}

const CreditCardDetails = async ({
  searchParams: { id },
}: CardDetailsProps) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

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

  const canUserAddTransaction = await getCanUserAddTransaction();

  return (
    <>
      <div className="sticky top-0 z-10 md:static md:z-0">
        <Navbar />
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto p-6 md:h-dvh md:overflow-hidden md:px-20 md:py-10">
        {!foundCreditCard ? (
          <EmptyListFeedback message="Cartão de crédito não encontrado" />
        ) : (
          <InvoiceDetails
            creditCard={creditCard}
            invoices={invoices}
            transactionsByInvoice={transactionsByInvoice}
            userName={userName || undefined}
            canUserAddTransaction={canUserAddTransaction}
          />
        )}
      </div>
    </>
  );
};

export default CreditCardDetails;
