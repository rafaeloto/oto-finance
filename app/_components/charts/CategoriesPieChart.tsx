"use client";

import { CardContent, CardHeader, CardTitle } from "@shadcn/card";
import type { TransactionPerCategory } from "@data/getCategorizedAmounts/types";
import EmptyListFeedback from "@atoms/EmptyListFeedback";
import ShouldRender from "@atoms/ShouldRender";
import TransactionsPieChart from "@components/charts/TransactionsPieChart";

type CategoriesPieChartProps = {
  categories: TransactionPerCategory[];
  title: string;
};

const CategoriesPieChart = ({ categories, title }: CategoriesPieChartProps) => {
  const hasNoData = categories.every((item) => item.totalAmount === 0);

  return (
    <div className="flex max-h-[600px] flex-col rounded-md border md:h-auto md:min-h-0 md:flex-1">
      <CardHeader>
        <CardTitle className="font-bold">{title}</CardTitle>
      </CardHeader>

      <CardContent className="min-h-0 flex-1 overflow-auto">
        <ShouldRender if={hasNoData}>
          <EmptyListFeedback message="Nenhuma transação registrada" />
        </ShouldRender>
        <ShouldRender if={!hasNoData}>
          <TransactionsPieChart categories={categories} />
        </ShouldRender>
      </CardContent>
    </div>
  );
};

export default CategoriesPieChart;
