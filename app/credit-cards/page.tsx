import { auth } from "@clerk/nextjs/server";
import Navbar from "@molecules/Navbar";
import { ScrollArea } from "../_components/ui/scroll-area";
import AddCreditCardButton from "./_components/add-credit-card-button";
import { redirect } from "next/navigation";
import CreditCardUnity from "./_components/credit-card-unity";
import EmptyListFeedback from "@atoms/EmptyListFeedback";
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

      <div className="flex h-dvh flex-col gap-6 overflow-hidden px-6 py-6 md:px-20 md:py-10">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">Cartões de crédito</h1>
          <AddCreditCardButton />
        </div>

        {hasNoData ? (
          <EmptyListFeedback message="Nenhum cartão registrado" />
        ) : (
          <ScrollArea className="h-full">
            <div className="flex flex-wrap justify-center gap-3 md:gap-10">
              {creditCards.map(async (card) => (
                <CreditCardUnity
                  key={card.id}
                  creditCard={card}
                  userName={userName || undefined}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </>
  );
};

export default CreditCards;
