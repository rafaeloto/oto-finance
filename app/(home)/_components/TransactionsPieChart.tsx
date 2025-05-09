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
import type { TransactionPercentagePerType } from "@data/getDashboard/types";
import Icon from "@atoms/Icon";
import PercentageItem from "./PercentageItem";
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
  investmentsEvolution: number;
  gainsTotal: number;
  expensesTotal: number;
}

const TransactionsPieChart = ({
  typesPercentage,
  investmentsEvolution,
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
      amount: Math.abs(investmentsEvolution),
      fill: "#FFFFFF",
    },
  ];

  const hasNoData = chartData.every((item) => item.amount === 0);

  return (
    <Card className="flex h-[420px] flex-col px-6 md:h-full">
      {hasNoData ? (
        <EmptyListFeedback message="Nenhuma transação registrada" />
      ) : (
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square md:max-h-[50%]"
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
              icon={
                <Icon name="TrendingUp" size={16} className="text-primary" />
              }
              title="Receita"
              value={typesPercentage[TransactionType.GAIN]}
            />

            <PercentageItem
              icon={
                <Icon name="TrendingDown" size={16} className="text-red-500" />
              }
              title="Despesas"
              value={typesPercentage[TransactionType.EXPENSE]}
            />

            <PercentageItem
              icon={<Icon name="PiggyBank" size={16} />}
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
