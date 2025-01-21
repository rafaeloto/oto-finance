import EmptyListFeedback from "@/app/_components/empty-list-feedback";
import Navbar from "@/app/_components/navbar";
import { getCreditCardById } from "@/app/_data/get-credit-card-by-id";
import { getInvoices } from "@/app/_data/get-invoices";
import CreditCardUnity from "../_components/credit-card-unity";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/_components/ui/tabs";
import { InvoiceStatus } from "@prisma/client";
import InvoiceList from "./_components/invoice-list";
import { Card } from "@/app/_components/ui/card";
import { INVOICE_STATUS_LABELS } from "@/app/_constants/credit-card";

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

  // Function to filter invoices by status
  const getFilteredInvoices = (status: InvoiceStatus) =>
    invoices.filter((invoice) => invoice.status === status);

  return (
    <>
      <Navbar />

      <div className="flex h-screen flex-col space-y-6 overflow-hidden px-20 py-10">
        {!foundCreditCard ? (
          <EmptyListFeedback message="Cartão de crédito não encontrado" />
        ) : (
          <div className="grid h-full grid-cols-2 gap-6">
            {/* Parte esquerda */}
            <div className="flex flex-col space-y-6">
              {/* Cartão */}
              <CreditCardUnity creditCard={creditCard} complete={false} />

              {/* Tabs */}
              <Card className="h-full">
                <Tabs defaultValue="PAID" className="h-full w-full">
                  <TabsList className="h-[10%] w-full justify-between px-10">
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

                  {/* Conteúdo das tabs */}
                  <TabsContent value="PAID" className="m-0 h-[90%]">
                    <InvoiceList invoices={getFilteredInvoices("PAID")} />
                  </TabsContent>
                  <TabsContent value="CLOSED" className="m-0 h-[90%]">
                    <InvoiceList invoices={getFilteredInvoices("CLOSED")} />
                  </TabsContent>
                  <TabsContent value="OPEN" className="m-0 h-[90%]">
                    <InvoiceList invoices={getFilteredInvoices("OPEN")} />
                  </TabsContent>
                </Tabs>
              </Card>
            </div>

            {/* Parte direita (vazia por enquanto) */}
            <Card className="h-full" />
          </div>
        )}
      </div>
    </>
  );
};

export default CreditCardDetails;
