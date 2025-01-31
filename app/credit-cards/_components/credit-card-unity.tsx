import { CreditCard } from "@prisma/client";
import { Card } from "@/app/_components/ui/card";
import Image from "next/image";
import { calculateClosingAndDueDates } from "@/app/_utils/date";
import { Button } from "@/app/_components/ui/button";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import ShouldRender from "@/app/_components/_atoms/should-render";

interface CreditCardUnityProps {
  creditCard: CreditCard;
  userName?: string;
  complete?: boolean;
}

const CreditCardUnity = ({
  creditCard,
  userName,
  complete = true,
}: CreditCardUnityProps) => {
  const { closingDate, dueDate } = calculateClosingAndDueDates(
    creditCard.closingDate,
    creditCard.dueDate,
  );

  return (
    <Card
      className={`relative flex flex-col items-center rounded-2xl border-transparent pb-3 ${complete && "duration-150 hover:border-gray-600"}`}
    >
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
          <p className="font-mono text-lg tracking-widest">
            XXXX XXXX XXXX XXXX
          </p>

          <div className="flex h-8 w-10 items-center justify-center rounded-sm bg-gradient-to-b from-yellow-500 to-yellow-700 shadow-inner">
            <Image src="/chip.svg" alt="chip" width={40} height={32} />
          </div>
        </div>

        {/* User name, closing and due date of the invoice */}
        <div className="flex items-center justify-between">
          <p className="mt-2 text-base font-semibold uppercase">
            {userName || "USUÁRIO"}
          </p>

          <div className="flex gap-5">
            <div className="flex flex-col items-center justify-center">
              <p className="text-xs">Fechamento</p>
              <p className="text-sm font-semibold">{closingDate}</p>
            </div>

            <div className="flex flex-col items-center justify-center">
              <p className="text-xs">Vencimento</p>
              <p className="text-sm font-semibold">{dueDate}</p>
            </div>
          </div>
        </div>
      </Card>

      <ShouldRender if={complete}>
        <Button
          variant="ghost"
          className="mt-3 flex items-center space-x-1"
          asChild
        >
          <Link href={`/credit-cards/details?id=${creditCard.id}`}>
            <span>Ver detalhes</span>
            <ArrowRightIcon />
          </Link>
        </Button>
      </ShouldRender>
    </Card>
  );
};

export default CreditCardUnity;
