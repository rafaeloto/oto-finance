"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip } from "@shadcn/chart";
import type { TransactionPerCategory } from "@data/getCategorizedAmounts/types";
import Icon, { type LucideIconName } from "@atoms/Icon";
import PercentageItem from "@components/charts/PercentageItem";
import { formatCurrency } from "@utils/currency";

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (!active || !payload?.length) return null;

  const item = payload[0];
  const { name, value, payload: itemData } = item;

  return (
    <div className="rounded-md border border-border bg-background p-2 text-lg shadow-lg">
      <div className="flex items-center justify-center gap-2">
        <Icon
          name={itemData.icon as LucideIconName}
          size={20}
          color={itemData.fill}
        />
        <span className="font-medium">{name}</span>
      </div>
      <div className="mt-1 flex items-center justify-center gap-2">
        {formatCurrency(Number(value))}
        <span className="text-muted-foreground">({itemData.percentage}%)</span>
      </div>
    </div>
  );
};

interface TransactionsPieChartProps {
  categories: TransactionPerCategory[];
}

const TransactionsPieChart = ({ categories }: TransactionsPieChartProps) => {
  const chartData = categories.map((category, index) => ({
    id: index,
    name: category.name,
    value: category.totalAmount,
    fill: category.color,
    icon: category.icon,
    percentage: category.percentageOfTotal,
  }));

  const chartConfig = categories.reduce(
    (acc, category) => ({
      ...acc,
      [category.name]: {
        label: category.name,
        color: category.color,
      },
    }),
    {} satisfies ChartConfig,
  );

  return (
    <div className="flex h-full flex-col md:flex-row md:items-center">
      {/* Graph - ocupies full width on mobile and half width on desktop */}
      <div className="h-[250px] w-full md:w-1/2">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip cursor={false} content={<CustomTooltip />} />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius="60%"
                outerRadius="90%"
                paddingAngle={1}
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

      {/* Percentage items - ocupies full width on mobile and half width on desktop */}
      <div className="mt-4 h-full max-h-[237px] w-full overflow-y-auto px-4 md:mt-0 md:h-auto md:max-h-full md:w-1/2 md:px-2">
        <div className="space-y-3">
          {categories.map((category) => (
            <PercentageItem
              key={category.name}
              icon={
                <Icon
                  name={category.icon as LucideIconName}
                  size={20}
                  color={category.color}
                />
              }
              title={category.name}
              value={category.percentageOfTotal}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransactionsPieChart;
