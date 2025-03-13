import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "../_components/_molecules/navbar";
import SummaryCards from "./_components/summary-cards";
import TimeSelect from "./_components/time-select";
import { isMatch } from "date-fns";
import TransactionsPieChart from "./_components/transactions-pie-chart";
import { getDashboard } from "../_data/get-dashboard";
import ExpensesPerCategory from "./_components/expenses-per-category";
import LastTransactions from "./_components/last-transactions";
import { canUserAddTransaction } from "../_data/can-user-add-transaction";
import AiReportButton from "./_components/ai-report-button";

interface HomeProps {
  searchParams: {
    month: string;
    year: string;
  };
}

const updateQueryParams = (params: HomeProps["searchParams"]): string => {
  const urlParams = new URLSearchParams(params);
  return `?${urlParams.toString()}`;
};

const Home = async ({ searchParams: { month, year } }: HomeProps) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const monthIsInvalid = !month || !isMatch(month, "MM");
  const yearIsInvalid = !year || !/^\d{4}$/.test(year);

  if (monthIsInvalid || yearIsInvalid) {
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");
    const currentYear = String(new Date().getFullYear());

    redirect(
      updateQueryParams({
        month: monthIsInvalid ? currentMonth : month,
        year: yearIsInvalid ? currentYear : currentYear,
      }),
    );
  }

  const dashboard = await getDashboard(month, year);
  const userCanAddTransaction = await canUserAddTransaction();
  const user = await clerkClient().users.getUser(userId);

  return (
    <>
      <Navbar />
      <div className="flex h-screen flex-col space-y-6 overflow-hidden p-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex gap-3">
            <AiReportButton
              month={month}
              hasPremiumPlan={
                user?.publicMetadata.subscriptionPlan === "premium"
              }
            />
            <TimeSelect />
          </div>
        </div>
        <div className="grid flex-1 grid-cols-[2fr,1fr] gap-6 overflow-hidden">
          <div className="flex flex-col gap-6 overflow-hidden">
            <SummaryCards
              month={month}
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
