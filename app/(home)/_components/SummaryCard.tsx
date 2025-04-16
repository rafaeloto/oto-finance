import ShouldRender from "@atoms/ShouldRender";
import { cn } from "@/app/_lib/utils";
import { Card, CardHeader, CardContent } from "@shadcn/card";
import Link from "next/link";
import { ReactNode } from "react";

interface SummaryCardProps {
  icon: ReactNode;
  title: string;
  amount: number;
  link: string;
  size?: "small" | "large";
  textColor?: string;
  period?: string;
  className?: string;
}

// Mapping styles by size variant
const sizeStyles = {
  small: {
    card: "", // sem estilo extra
    title: "text-muted-foreground",
    amount: "text-2xl",
  },
  large: {
    card: "bg-white bg-opacity-5",
    title: "text-white opacity-70",
    amount: "text-4xl",
  },
};

const SummaryCard = ({
  icon,
  title,
  amount,
  link,
  size = "small",
  textColor,
  period,
  className = "",
}: SummaryCardProps) => {
  const styles = sizeStyles[size];

  return (
    <Link href={link} className={className}>
      <Card className={styles.card}>
        <CardHeader className="flex-row items-center gap-2 space-y-0">
          {icon}
          <p className={styles.title}>{title}</p>
          <ShouldRender if={!!period}>
            <span className={styles.title}>-</span>
            <p className={styles.title}>{period}</p>
          </ShouldRender>
        </CardHeader>

        <CardContent className="flex justify-between">
          <p className={cn("font-bold", textColor, styles.amount)}>
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(amount)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default SummaryCard;
