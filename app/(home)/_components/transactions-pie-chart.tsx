"use client";

import { Pie, PieChart } from "recharts";

import { Card, CardContent } from "@shadcn/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@shadcn/chart";
import { TransactionType } from "@prisma/client";
import { TransactionPercentagePerType } from "@/app/_data/get-dashboard/types";
import { PiggyBankIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import PercentageItem from "./percentage-item";
import EmptyListFeedback from "@atoms/EmptyListFeedback";

const chartConfig = {
  [TransactionType.INVESTMENT]: {
    label: "Investido",
    color: "#FFFFFF",
  },
  [TransactionType.GAIN]: {
    label: "Receita",
    color: "#55B02E",
  },
  [TransactionType.EXPENSE]: {
    label: "Despesas",
    color: "#E93030",
  },
} satisfies ChartConfig;

interface TransactionsPieChartProps {
  typesPercentage: TransactionPercentagePerType;
  investmentsTotal: number;
  gainsTotal: number;
  expensesTotal: number;
}

const TransactionsPieChart = ({
  typesPercentage,
  investmentsTotal,
  gainsTotal,
  expensesTotal,
}: TransactionsPieChartProps) => {
  const chartData = [
    {
      type: TransactionType.GAIN,
      amount: gainsTotal,
      fill: "#55B02E",
    },
    {
      type: TransactionType.EXPENSE,
      amount: expensesTotal,
      fill: "#E93030",
    },
    {
      type: TransactionType.INVESTMENT,
      amount: investmentsTotal,
      fill: "#FFFFFF",
    },
  ];

  const hasNoData = chartData.every((item) => item.amount === 0);

  return (
    <Card className="flex flex-col px-6">
      {hasNoData ? (
        <EmptyListFeedback message="Nenhuma transação registrada" />
      ) : (
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[230px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="type"
                innerRadius={60}
              />
            </PieChart>
          </ChartContainer>

          <div className="space-y-2">
            <PercentageItem
              icon={<TrendingUpIcon size={16} className="text-primary" />}
              title="Receita"
              value={typesPercentage[TransactionType.GAIN]}
            />

            <PercentageItem
              icon={<TrendingDownIcon size={16} className="text-red-500" />}
              title="Despesas"
              value={typesPercentage[TransactionType.EXPENSE]}
            />

            <PercentageItem
              icon={<PiggyBankIcon size={16} />}
              title="Investido"
              value={typesPercentage[TransactionType.INVESTMENT]}
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default TransactionsPieChart;
