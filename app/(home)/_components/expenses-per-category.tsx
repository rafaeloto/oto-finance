import EmptyListFeedback from "@/app/_components/_atoms/empty-list-feedback";
import { CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { Progress } from "@/app/_components/ui/progress";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { EXPENSE_TRANSACTION_CATEGORY_LABELS } from "@/app/_constants/transaction";
import { TotalExpensePerCategory } from "@/app/_data/get-dashboard/types";

interface ExpensesPerCategoryProps {
  expensesPerCategory: TotalExpensePerCategory[];
}

const ExpensesPerCategory = ({
  expensesPerCategory,
}: ExpensesPerCategoryProps) => {
  const hasNoData = expensesPerCategory.length === 0;

  return (
    <div className="col-span-2 flex min-h-0 flex-1 flex-col rounded-md border pb-6">
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
