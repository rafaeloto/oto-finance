import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "@molecules/Navbar";
import SummaryCards from "./_components/summary-cards";
import TimeSelect from "@molecules/TimeSelect";
import TransactionsPieChart from "./_components/transactions-pie-chart";
import { getDashboard } from "@data/getDashboard";
import ExpensesPerCategory from "./_components/expenses-per-category";
import LastTransactions from "./_components/last-transactions";
import { canUserAddTransaction } from "@data/canUserAddTransaction";
// import AiReportButton from "./_components/ai-report-button";
import { getValidDateFromParams } from "@utils/date";
// import { getUser } from "@data/getUser";

interface HomeProps {
  searchParams: {
    month: string;
    year: string;
  };
}

const Home = async ({ searchParams: { month, year } }: HomeProps) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const { validMonth, validYear } = getValidDateFromParams(month, year);

  const dashboard = await getDashboard(validMonth, validYear);
  const userCanAddTransaction = await canUserAddTransaction();
  // const user = await getUser()

  return (
    <>
      <Navbar />
      <div className="flex h-screen flex-col space-y-6 overflow-hidden p-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex gap-3">
            {/* TODO: Add this back once the AI report feature is fixed */}
            {/* <AiReportButton
              month={validMonth}
              year={validYear}
              hasPremiumPlan={
                user?.publicMetadata.subscriptionPlan === "premium"
              }
            /> */}
            <TimeSelect />
          </div>
        </div>
        <div className="grid flex-1 grid-cols-[2fr,1fr] gap-6 overflow-hidden">
          <div className="flex flex-col gap-6 overflow-hidden">
            <SummaryCards
              {...dashboard}
              userCanAddTransaction={userCanAddTransaction}
            />
            <div className="grid h-full grid-cols-3 grid-rows-1 gap-6 overflow-hidden">
              <TransactionsPieChart {...dashboard} />
              <ExpensesPerCategory
                expensesPerCategory={dashboard.totalExpensePerCategory}
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
