import { CreditCard } from "@prisma/client";
import { Card } from "@/app/_components/ui/card";
import Image from "next/image";
import { clerkClient } from "@clerk/nextjs/server";
import { format } from "date-fns";

interface CreditCardUnityProps {
  creditCard: CreditCard;
}

const CreditCardUnity = async ({ creditCard }: CreditCardUnityProps) => {
  const user = await clerkClient().users.getUser(creditCard.userId);

  // Helper function to calculate closing and due dates
  const calculateDate = (day: number): string => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const year = today.getFullYear();
    const month =
      day >= today.getDate()
        ? currentMonth // Dia está no futuro: mês atual
        : currentMonth + 1; // Dia já passou: próximo mês

    const date = new Date(year, month, day);
    return format(date, "dd/MM");
  };

  return (
    <Card
      className={`flex h-[220px] w-[400px] flex-col justify-between rounded-2xl bg-gradient-to-r p-5 ${creditCard.color}`}
    >
      {/* Cart name and flag logo*/}
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">{creditCard.name}</p>

        <Image
          src={`/credit-cards/${creditCard.flag}.svg`}
          alt={creditCard.flag}
          width={48}
          height={48}
        />
      </div>

      {/* Fake number and chip */}
      <div className="flex items-center justify-between">
        <p className="font-mono text-lg tracking-widest">XXXX XXXX XXXX XXXX</p>

        <div className="flex h-8 w-10 items-center justify-center rounded-sm bg-gradient-to-b from-yellow-500 to-yellow-700 shadow-inner">
          <Image src="chip.svg" alt="chip" width={40} height={32} />
        </div>
      </div>

      {/* User name, closing and due date of the invoice */}
      <div className="flex items-center justify-between">
        <p className="mt-2 text-base font-semibold uppercase">
          {user.fullName || "USUÁRIO DESCONHECIDO"}
        </p>

        <div className="flex gap-5">
          <div className="flex flex-col items-center justify-center">
            <p className="text-xs">Fechamento</p>
            <p className="text-sm font-semibold">
              {calculateDate(creditCard.closingDate)}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center">
            <p className="text-xs">Vencimento</p>
            <p className="text-sm font-semibold">
              {calculateDate(creditCard.dueDate)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CreditCardUnity;
