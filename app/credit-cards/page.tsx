import { auth } from "@clerk/nextjs/server";
import Navbar from "../_components/navbar";
import { ScrollArea } from "../_components/ui/scroll-area";
import AddCreditCardButton from "./_components/add-credit-card-button";
import { redirect } from "next/navigation";
import CreditCardUnity from "./_components/credit-card-unity";
import EmptyListFeedback from "../_components/empty-list-feedback";
import { getCreditCards } from "../_data/get-credit-cards";

const CreditCards = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const creditCards = await getCreditCards();

  const hasNoData = creditCards.length === 0;

  return (
    <>
      <Navbar />

      <div className="flex flex-col space-y-6 overflow-hidden p-6">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">Cartões de crédito</h1>
          <AddCreditCardButton />
        </div>

        {hasNoData ? (
          <EmptyListFeedback message="Nenhuma conta registrada" />
        ) : (
          <ScrollArea className="h-full">
            <div className="flex justify-center">
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {creditCards.map((card) => (
                  <CreditCardUnity key={card.id} creditCard={card} />
                ))}
              </div>
            </div>
          </ScrollArea>
        )}
      </div>
    </>
  );
};

export default CreditCards;
