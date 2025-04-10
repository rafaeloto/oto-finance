import EmptyListFeedback from "@atoms/EmptyListFeedback";
import { CardContent, CardHeader, CardTitle } from "@shadcn/card";
import { Progress } from "@shadcn/progress";
import { ScrollArea } from "@shadcn/scroll-area";
import { EXPENSE_TRANSACTION_CATEGORY_LABELS } from "@constants/transaction";
import type { TotalExpensePerCategory } from "@data/getDashboard/types";

interface ExpensesPerCategoryProps {
  expensesPerCategory: TotalExpensePerCategory[];
}

const ExpensesPerCategory = ({
  expensesPerCategory,
}: ExpensesPerCategoryProps) => {
  const hasNoData = expensesPerCategory.length === 0;

  return (
    <div className="col-span-2 flex max-h-[500px] flex-col rounded-md border pb-6 md:h-auto md:min-h-0 md:flex-1">
      <CardHeader>
        <CardTitle className="font-bold">Gastos por Categoria</CardTitle>
      </CardHeader>

      <ScrollArea className="min-h-0 flex-1 overflow-auto">
        {hasNoData ? (
          <EmptyListFeedback message="Nenhum gasto registrado" />
        ) : (
          <CardContent className="space-y-6">
            {expensesPerCategory.map((category) => (
              <div key={category.category} className="space-y-2">
                <div className="flex w-full justify-between">
                  <p className="text-sm font-bold">
                    {EXPENSE_TRANSACTION_CATEGORY_LABELS[category.category]}
                  </p>
                  <p className="text-sm font-bold">
                    {category.percentageOfTotal}%
                  </p>
                </div>
                <Progress value={category.percentageOfTotal} />
              </div>
            ))}
          </CardContent>
        )}
      </ScrollArea>
    </div>
  );
};

export default ExpensesPerCategory;
