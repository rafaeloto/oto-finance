import Navbar from "@molecules/Navbar";
import CategoriesPieChart from "@components/charts/CategoriesPieChart";
import SubcategoriesPieChart from "@components/charts/SubcategoriesPieChart";
import { getAnalytics } from "@data/getAnalytics";
import LastTransactions from "../(home)/_components/LastTransactions";
import { getValidDateFromParams } from "@utils/date";
import DashboardFilter from "@molecules/DashboardFilter";
import { MONTH_NAMES } from "@constants/month";

interface HomeProps {
  searchParams: {
    month: string;
    year: string;
    ignoreLoans?: string;
    cashflowView?: string;
  };
}

const Analytics = async ({
  searchParams: { month, year, ignoreLoans, cashflowView },
}: HomeProps) => {
  const { validMonth, validYear } = getValidDateFromParams(month, year);

  const analytics = await getAnalytics(
    validMonth,
    validYear,
    ignoreLoans,
    cashflowView,
  );

  return (
    <>
      <div className="sticky top-0 z-10 md:static md:z-0">
        <Navbar />
        <div className="flex items-center justify-between space-x-2 px-3 py-6 pl-6 md:space-x-4 md:px-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Análises</h1>
            <h1 className="text-2xl font-bold">-</h1>
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
              categories={analytics.expensesPerCategory}
              title="Gastos por Categoria"
            />
            <SubcategoriesPieChart
              transactionsPerParentCategory={analytics.expensesPerSubCategory}
              title="Gastos por Subcategoria"
              parentCategoryOptions={analytics.parentCategoryOptions.expense}
            />
            <CategoriesPieChart
              categories={analytics.gainsPerCategory}
              title="Receitas por Categoria"
            />
            <SubcategoriesPieChart
              transactionsPerParentCategory={analytics.gainsPerSubCategory}
              title="Receitas por Subcategoria"
              parentCategoryOptions={analytics.parentCategoryOptions.gain}
            />
          </div>

          <LastTransactions lastTransactions={analytics.lastTransactions} />
        </div>
      </div>
    </>
  );
};

export default Analytics;
