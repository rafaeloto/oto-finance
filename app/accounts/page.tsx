import { auth } from "@clerk/nextjs/server";
import Navbar from "@molecules/Navbar";
import AddAccountButton from "./_components/AddAccountButton";
import RecalculateBalancesButton from "./_components/RecalculateBalancesButton";
import { redirect } from "next/navigation";
import AccountCard from "./_components/AccountCard";
import EmptyListFeedback from "@atoms/EmptyListFeedback";
import { getAccounts } from "@data/getAccounts";
import { getTotalBalance } from "@data/getTotalBalance";
import SummaryCard from "../(home)/_components/SummaryCard";
import Icon from "@atoms/Icon";
import ShouldRender from "../_components/atoms/ShouldRender";

const Accounts = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const accounts = await getAccounts();
  const totalBalance = await getTotalBalance();

  const hasNoData = accounts.length === 0;

  return (
    <>
      <div className="sticky top-0 z-10 md:static md:z-0">
        <Navbar />
        <div className="flex w-full items-center justify-between p-6 md:px-20 md:pt-10">
          <h1 className="text-2xl font-bold">Contas</h1>
          <div className="flex flex-row gap-3">
            <AddAccountButton />
            <RecalculateBalancesButton />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 overflow-y-auto px-6 pb-6 md:gap-10 md:px-20 md:pb-10">
        <ShouldRender if={!hasNoData}>
          <SummaryCard
            icon={<Icon name="Wallet" size={16} />}
            title="Saldo Total"
            amount={totalBalance}
            link="/accounts"
            size="large"
            className="w-full max-w-[350px] md:w-[350px]"
          />
        </ShouldRender>

        {hasNoData ? (
          <div className="h-96">
            <EmptyListFeedback message="Nenhuma conta registrada" />
          </div>
        ) : (
          <div className="flex w-full flex-col items-center gap-6 md:flex-row md:flex-wrap md:justify-center md:gap-10">
            {accounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Accounts;
