import { CreditCard } from "@prisma/client";
import { Card, CardContent } from "@/app/_components/ui/card";
import Image from "next/image";

interface CreditCardUnityProps {
  creditCard: CreditCard;
}

const CreditCardUnity = ({ creditCard }: CreditCardUnityProps) => {
  return (
    <Card className="flex max-w-[400px] items-center justify-around bg-white bg-opacity-5 p-10">
      {/* Imagem à esquerda */}
      <Image
        src={`/credit-cards/${creditCard.flag}.svg`}
        alt={creditCard.flag}
        width={64}
        height={64}
      />

      {/* Conteúdo à direita */}
      <CardContent className="flex flex-col justify-between gap-3 p-6">
        <p className="text-lg font-semibold text-white opacity-70">
          {creditCard.name}
        </p>
        <p className="text-center text-2xl font-bold">
          {Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(Number(creditCard.limit))}
        </p>
      </CardContent>
    </Card>
  );
};

export default CreditCardUnity;
