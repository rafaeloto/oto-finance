"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { CardContent, CardHeader, CardTitle } from "@shadcn/card";
import { ChartConfig, ChartContainer, ChartTooltip } from "@shadcn/chart";
import { TransactionType } from "@prisma/client";
import type { TransactionPercentagePerType } from "@data/getDashboard/types";
import Icon from "@atoms/Icon";
import PercentageItem from "./PercentageItem";
import EmptyListFeedback from "@atoms/EmptyListFeedback";
import { formatCurrency } from "@utils/currency";
import ShouldRender from "@/app/_components/atoms/ShouldRender";

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

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (!active || !payload?.length) return null;

  const item = payload[0];
  const type = item.name as keyof typeof chartConfig;
  const itemConfig = chartConfig[type];

  return (
    <div className="rounded-md border border-border bg-background p-2 text-lg shadow-lg">
      <div className="flex items-center justify-center gap-2">
        <div
          className="h-3 w-3 rounded-sm"
          style={{ backgroundColor: item.payload.fill }}
        />
        <span className="font-medium">{itemConfig?.label || item.name}</span>
      </div>
      <div className="mt-1 text-center">
        {formatCurrency(Number(item.value))}
      </div>
    </div>
  );
};

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
    <div className="flex max-h-[500px] flex-col rounded-md border pb-6 md:h-auto md:min-h-0 md:flex-1">
      <CardHeader>
        <CardTitle className="font-bold">Tipos de Transação</CardTitle>
      </CardHeader>

      <CardContent className="min-h-0 flex-1 overflow-auto">
        <ShouldRender if={hasNoData}>
          <EmptyListFeedback message="Nenhuma transação registrada" />
        </ShouldRender>

        <ShouldRender if={!hasNoData}>
          <div className="flex h-full flex-col md:flex-row md:items-center">
            {/* Graph - ocupies full width on mobile and half width on desktop */}
            <div className="h-[250px] w-full md:w-1/2">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <ChartTooltip cursor={false} content={<CustomTooltip />} />
                    <Pie
                      data={chartData}
                      dataKey="amount"
                      nameKey="type"
                      innerRadius="60%"
                      outerRadius="90%"
                      paddingAngle={2}
                      stroke="none"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            {/* Itens de porcentagem - Ocupa 1/3 no desktop, full width no mobile */}
            <div className="w-full md:w-1/2">
              <div className="space-y-2">
                <PercentageItem
                  icon={
                    <Icon
                      name="TrendingUp"
                      size={16}
                      className="text-primary"
                    />
                  }
                  title="Receita"
                  value={typesPercentage[TransactionType.GAIN]}
                />

                <PercentageItem
                  icon={
                    <Icon
                      name="TrendingDown"
                      size={16}
                      className="text-red-500"
                    />
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
            </div>
          </div>
        </ShouldRender>
      </CardContent>
    </div>
  );
};

export default TransactionsPieChart;
