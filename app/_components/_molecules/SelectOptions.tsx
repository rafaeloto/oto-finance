import Image from "next/image";
import { Bank } from "@prisma/client";

type AccountOptionParams = {
  name: string;
  bank: Bank;
};

export const AccountOption = ({ name, bank }: AccountOptionParams) => {
  return (
    <div className="flex items-center space-x-5">
      <Image
        src={`/banks/${bank}.svg`}
        alt={bank || "Banco"}
        width={20}
        height={20}
        {...(bank === "C6" && { className: "bg-white" })}
      />
      <span>{name}</span>
    </div>
  );
};
