import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "@molecules/Navbar";
import SummaryCards from "./_components/SummaryCards";
import TimeSelect from "@molecules/TimeSelect";
import TransactionsPieChart from "./_components/TransactionsPieChart";
import { getDashboard } from "@data/getDashboard";
import ExpensesPerCategory from "./_components/ExpensesPerCategory";
import LastTransactions from "./_components/LastTransactions";
import { getCanUserAddTransaction } from "@data/getCanUserAddTransaction";
// import AiReportButton from "./_components/AiReportButton";
import { getValidDateFromParams } from "@utils/date";
import AddTransactionButton from "@components/transaction/buttons/AddTransactionButton";
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
  const canUserAddTransaction = await getCanUserAddTransaction();
  // const user = await getUser()

  return (
    <>
      <div className="sticky top-0 z-10 md:static md:z-0">
        <Navbar />
        <div className="flex justify-center p-6 md:justify-between">
          <h1 className="hidden text-2xl font-bold md:block">Dashboard</h1>
          <div className="flex gap-3">
            <TimeSelect className="rounded-full" />
            {/* TODO: Add this back once the AI report feature is fixed */}
            {/* <AiReportButton
              month={validMonth}
              year={validYear}
              hasPremiumPlan={
                user?.publicMetadata.subscriptionPlan === "premium"
                }
                /> */}
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
            <div className="space-y-6 md:grid md:h-full md:grid-cols-3 md:grid-rows-1 md:gap-6 md:space-y-0 md:overflow-hidden">
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
