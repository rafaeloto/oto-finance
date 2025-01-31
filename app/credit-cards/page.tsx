import { auth } from "@clerk/nextjs/server";
import Navbar from "../_components/_molecules/navbar";
import { ScrollArea } from "../_components/ui/scroll-area";
import AddCreditCardButton from "./_components/add-credit-card-button";
import { redirect } from "next/navigation";
import CreditCardUnity from "./_components/credit-card-unity";
import EmptyListFeedback from "../_components/_atoms/empty-list-feedback";
import { getCreditCards } from "../_data/get-credit-cards";
import { getUser } from "../_data/get-user";

const CreditCards = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const creditCards = await getCreditCards();

  const { fullName: userName } = await getUser();

  const hasNoData = creditCards.length === 0;

  return (
    <>
      <Navbar />

      <div className="flex h-screen flex-col space-y-6 overflow-hidden px-20 py-10">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">Cartões de crédito</h1>
          <AddCreditCardButton />
        </div>

        {hasNoData ? (
          <EmptyListFeedback message="Nenhum cartão registrado" />
        ) : (
          <ScrollArea className="h-full">
            <div className="flex justify-center">
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {creditCards.map(async (card) => {
                  return (
                    <CreditCardUnity
                      key={card.id}
                      creditCard={card}
                      userName={userName || undefined}
                    />
                  );
                })}
              </div>
            </div>
          </ScrollArea>
        )}
      </div>
    </>
  );
};

export default CreditCards;
