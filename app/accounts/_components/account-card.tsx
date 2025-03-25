import { Account } from "@prisma/client";
import { Card, CardContent } from "@/app/_components/ui/card";
import Image from "next/image";

interface AccountCardProps {
  account: Account;
}

const AccountCard = ({ account }: AccountCardProps) => {
  return (
    <Card className="flex w-full max-w-[350px] items-center justify-around bg-white bg-opacity-5 p-10">
      {/* Imagem à esquerda */}
      <Image
        src={`/banks/${account.bank}.svg`}
        alt={account.bank}
        width={64}
        height={64}
      />

      {/* Conteúdo à direita */}
      <CardContent className="flex flex-col justify-between gap-3 p-6">
        <p className="text-lg font-semibold text-white opacity-70">
          {account.name}
        </p>
        <p className="text-center text-2xl font-bold">
          {Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(Number(account.balance))}
        </p>
      </CardContent>
    </Card>
  );
};

export default AccountCard;
