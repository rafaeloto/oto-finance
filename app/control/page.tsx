import Navbar from "@molecules/Navbar";
import CategoriesPieChart from "@components/charts/CategoriesPieChart";
import SubcategoriesPieChart from "@components/charts/SubcategoriesPieChart";
import { getControl } from "@data/getControl";
import LastTransactions from "../(home)/_components/LastTransactions";
import { getValidDateFromParams } from "@utils/date";
import DashboardFilter from "@molecules/DashboardFilter";
import { MONTH_NAMES } from "@constants/month";

interface HomeProps {
  searchParams: {
    month: string;
    year: string;
    ignoreLoans?: string;
  };
}

const Control = async ({
  searchParams: { month, year, ignoreLoans },
}: HomeProps) => {
  const { validMonth, validYear } = getValidDateFromParams(month, year);

  const control = await getControl(validMonth, validYear, ignoreLoans);

  return (
    <>
      <div className="sticky top-0 z-10 md:static md:z-0">
        <Navbar />
        <div className="flex items-center justify-between space-x-2 px-3 py-6 pl-6 md:space-x-4 md:px-6">
          <div className="flex flex-col items-start gap-2 md:flex-row md:items-center">
            <h1 className="text-2xl font-bold">Controle Financeiro</h1>
            <h1 className="hidden text-2xl font-bold md:block">-</h1>
            <h1 className="text-2xl font-bold text-muted-foreground">
              {MONTH_NAMES[Number(validMonth)]}/{validYear.slice(-2)}
            </h1>
          </div>

          <div className="scrollbar-hidden flex gap-1 overflow-x-auto md:gap-3 md:overflow-x-visible">
            <DashboardFilter />
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-6 overflow-y-auto p-3 pt-0 md:h-screen md:overflow-hidden md:px-6 md:pb-6">
        <div className="flex flex-col gap-6 md:grid md:flex-1 md:grid-cols-3 md:overflow-hidden">
          <div className="space-y-6 md:col-span-2 md:grid md:h-full md:grid-cols-2 md:gap-6 md:space-y-0 md:overflow-hidden">
            <CategoriesPieChart
              categories={control.expensesPerCategory}
              title="Gastos por Categoria"
            />
            <SubcategoriesPieChart
              transactionsPerParentCategory={control.expensesPerSubCategory}
              title="Gastos por Subcategoria"
              parentCategoryOptions={control.parentCategoryOptions.expense}
            />
            <CategoriesPieChart
              categories={control.gainsPerCategory}
              title="Receitas por Categoria"
            />
            <SubcategoriesPieChart
              transactionsPerParentCategory={control.gainsPerSubCategory}
              title="Receitas por Subcategoria"
              parentCategoryOptions={control.parentCategoryOptions.gain}
            />
          </div>

          <LastTransactions lastTransactions={control.lastTransactions} />
        </div>
      </div>
    </>
  );
};

export default Control;
