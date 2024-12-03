import AddTransactionButton from "@/app/_components/transaction/add-transaction-button";
import { Card, CardHeader, CardContent } from "@/app/_components/ui/card";
import { Account } from "@prisma/client";
import { ReactNode } from "react";

interface SummaryCardProps {
  icon: ReactNode;
  title: string;
  amount: number;
  size?: "small" | "large";
  userCanAddTransaction?: boolean;
  accounts?: Account[];
}

const SummaryCard = ({
  icon,
  title,
  amount,
  size = "small",
  userCanAddTransaction,
  accounts,
}: SummaryCardProps) => {
  return (
    <Card className={`${size === "large" ? "bg-white bg-opacity-5" : ""}`}>
      <CardHeader className="flex-row items-center gap-2">
        {icon}
        <p
          className={`${size === "small" ? "text-muted-foreground" : "text-white opacity-70"}`}
        >
          {title}
        </p>
      </CardHeader>

      <CardContent className="flex justify-between">
        <p
          className={`font-bold ${size === "small" ? "text-2xl" : "text-4xl"}`}
        >
          {Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(amount)}
        </p>

        {size === "large" && (
          <AddTransactionButton
            userCanAddTransaction={userCanAddTransaction}
            accounts={accounts}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
