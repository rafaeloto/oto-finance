"use client";

import { CardContent, CardHeader, CardTitle } from "@shadcn/card";
import type { TransactionsPerParentCategory } from "@data/getSubCategorizedAmounts/types";
import EmptyListFeedback from "@atoms/EmptyListFeedback";
import ShouldRender from "@atoms/ShouldRender";
import TransactionsPieChart from "@components/charts/TransactionsPieChart";
import SelectFilter from "@molecules/SelectFilter";
import Icon, { type LucideIconName } from "@atoms/Icon";
import { Category } from "@prisma/client";
import { useEffect, useMemo, useState } from "react";

type SubcategoriesPieChartProps = {
  title: string;
  transactionsPerParentCategory: TransactionsPerParentCategory[];
  parentCategoryOptions: Category[];
};

const SubcategoriesPieChart = ({
  transactionsPerParentCategory,
  title,
  parentCategoryOptions,
}: SubcategoriesPieChartProps) => {
  const hasNoData = transactionsPerParentCategory?.every((item) =>
    item.categories.every((category) => category.totalAmount === 0),
  );

  const [selectedParentCategory, setSelectedParentCategory] = useState<string>(
    transactionsPerParentCategory[0]?.parentCategoryId,
  );

  // Updates the selectedParentCategory when the transactionsPerParentCategory change
  useEffect(() => {
    // If the selected category does not exist in the options
    if (
      !transactionsPerParentCategory.some(
        (cat) => cat.parentCategoryId === selectedParentCategory,
      )
    ) {
      // Selects the first available category
      setSelectedParentCategory(
        transactionsPerParentCategory[0]?.parentCategoryId,
      );
    }
  }, [transactionsPerParentCategory, selectedParentCategory]);

  const currentCategories = useMemo(
    () =>
      transactionsPerParentCategory.find(
        (item) => item.parentCategoryId === selectedParentCategory,
      )?.categories || [],
    [selectedParentCategory, transactionsPerParentCategory],
  );

  return (
    <div className="flex max-h-[600px] flex-col rounded-md border md:h-auto md:min-h-0 md:flex-1">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle className="font-bold">{title}</CardTitle>

        <SelectFilter
          paramKey="parentCategoryId"
          value={selectedParentCategory}
          onChange={(value) => {
            if (value) setSelectedParentCategory(value);
          }}
          options={parentCategoryOptions.map((category) => ({
            value: category.id,
            label: (
              <div className="flex items-center gap-3">
                <Icon
                  name={category.icon as LucideIconName}
                  {...(!!category.color && { color: category.color })}
                />
                <p>{category.name}</p>
              </div>
            ),
          }))}
          placeholder="Categoria"
          isInsideModal
          hideClearButton
        />
      </CardHeader>

      <CardContent className="min-h-0 flex-1 overflow-auto">
        <ShouldRender if={hasNoData}>
          <EmptyListFeedback message="Nenhuma transação registrada" />
        </ShouldRender>
        <ShouldRender if={!hasNoData}>
          <TransactionsPieChart categories={currentCategories} />
        </ShouldRender>
      </CardContent>
    </div>
  );
};

export default SubcategoriesPieChart;
