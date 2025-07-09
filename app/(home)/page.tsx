import Navbar from "@molecules/Navbar";
import SummaryCards from "./_components/SummaryCards";
import CategoriesPieChart from "@components/charts/CategoriesPieChart";
import { getDashboard } from "@data/getDashboard";
import LastTransactions from "./_components/LastTransactions";
import { getCanUserAddTransaction } from "@data/getCanUserAddTransaction";
import AiReportButton from "./_components/AiReportButton";
import { getValidDateFromParams } from "@utils/date";
import AddTransactionButton from "@components/transaction/buttons/AddTransactionButton";
import { getUser } from "@data/getUser";
import DashboardFilter from "@molecules/DashboardFilter";
import { MONTH_NAMES } from "@constants/month";

interface HomeProps {
  searchParams: {
    month: string;
    year: string;
    ignoreLoans?: string;
  };
}

const Home = async ({
  searchParams: { month, year, ignoreLoans },
}: HomeProps) => {
  const { validMonth, validYear } = getValidDateFromParams(month, year);

  const dashboard = await getDashboard(validMonth, validYear, ignoreLoans);
  const canUserAddTransaction = await getCanUserAddTransaction();
  const user = await getUser();

  return (
    <>
      <div className="sticky top-0 z-10 md:static md:z-0">
        <Navbar />
        <div className="flex items-center justify-between space-x-2 px-3 py-6 md:space-x-4 md:px-6">
          <div className="flex items-center space-x-2">
            <h1 className="hidden text-2xl font-bold md:block">Dashboard</h1>
            <h1 className="hidden text-2xl font-bold md:block">-</h1>
            <h1 className="text-2xl font-bold">
              {MONTH_NAMES[Number(validMonth)]}/{validYear.slice(-2)}
            </h1>
          </div>

          <div className="scrollbar-hidden flex gap-1 overflow-x-auto md:gap-3 md:overflow-x-visible">
            <DashboardFilter />
            <AiReportButton
              month={validMonth}
              year={validYear}
              hasPremiumPlan={
                user?.publicMetadata.subscriptionPlan === "premium"
              }
            />
            <AddTransactionButton
              canUserAddTransaction={canUserAddTransaction}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-6 overflow-y-auto p-3 pt-0 md:h-screen md:overflow-hidden md:px-6 md:pb-6">
        <div className="flex flex-col gap-6 md:grid md:flex-1 md:grid-cols-[2fr,1fr] md:overflow-hidden">
          <div className="flex flex-col gap-6 md:overflow-hidden">
            <SummaryCards
              {...dashboard}
              period={`${validMonth}/${validYear.slice(-2)}`}
            />
            <div className="space-y-6 md:grid md:h-full md:grid-cols-2 md:grid-rows-1 md:gap-6 md:space-y-0 md:overflow-hidden">
              <CategoriesPieChart
                categories={dashboard.expensesPerCategory}
                title="Gastos por Categoria"
              />
              <CategoriesPieChart
                categories={dashboard.gainsPerCategory}
                title="Receitas por Categoria"
              />
            </div>
          </div>
          <LastTransactions lastTransactions={dashboard.lastTransactions} />
        </div>
      </div>
    </>
  );
};

export default Home;
