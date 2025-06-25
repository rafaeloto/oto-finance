import EmptyListFeedback from "@atoms/EmptyListFeedback";
import { CardContent, CardHeader, CardTitle } from "@shadcn/card";
import { Progress } from "@shadcn/progress";
import { ScrollArea } from "@shadcn/scroll-area";
import type { TotalExpensePerCategory } from "@data/getDashboard/types";
import ShouldRender from "@atoms/ShouldRender";

interface ExpensesPerCategoryProps {
  expensesPerCategory: TotalExpensePerCategory[];
}

const ExpensesPerCategory = ({
  expensesPerCategory,
}: ExpensesPerCategoryProps) => {
  const hasNoData = expensesPerCategory.length === 0;

  return (
    <div className="flex max-h-[500px] flex-col rounded-md border pb-6 md:h-auto md:min-h-0 md:flex-1">
      <CardHeader>
        <CardTitle className="font-bold">Gastos por Categoria</CardTitle>
      </CardHeader>

      <ScrollArea className="min-h-0 flex-1 overflow-auto">
        <ShouldRender if={hasNoData}>
          <EmptyListFeedback message="Nenhum gasto registrado" />
        </ShouldRender>

        <ShouldRender if={!hasNoData}>
          <CardContent className="space-y-6">
            {expensesPerCategory.map((category) => (
              <div key={category.category} className="space-y-2">
                <div className="flex w-full justify-between">
                  <p className="text-sm font-bold">{category.category}</p>
                  <p className="text-sm font-bold">
                    {category.percentageOfTotal}%
                  </p>
                </div>
                <Progress value={category.percentageOfTotal} />
              </div>
            ))}
          </CardContent>
        </ShouldRender>
      </ScrollArea>
    </div>
  );
};

export default ExpensesPerCategory;
