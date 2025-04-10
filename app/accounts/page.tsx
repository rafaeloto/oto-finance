import { auth } from "@clerk/nextjs/server";
import Navbar from "@molecules/Navbar";
import { ScrollArea } from "@shadcn/scroll-area";
import AddAccountButton from "./_components/AddAccountButton";
import RecalculateBalancesButton from "./_components/RecalculateBalancesButton";
import { redirect } from "next/navigation";
import AccountCard from "./_components/AccountCard";
import EmptyListFeedback from "@atoms/EmptyListFeedback";
import { getAccounts } from "@data/getAccounts";

const Accounts = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const accounts = await getAccounts();

  const hasNoData = accounts.length === 0;

  return (
    <>
      <Navbar />

      <div className="flex h-dvh flex-col gap-6 overflow-hidden px-6 py-6 md:px-20 md:py-10">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">Contas</h1>
          <div className="flex flex-row gap-3">
            <AddAccountButton />
            <RecalculateBalancesButton />
          </div>
        </div>

        {hasNoData ? (
          <EmptyListFeedback message="Nenhuma conta registrada" />
        ) : (
          <ScrollArea className="h-full">
            <div className="flex flex-wrap justify-center gap-6 md:gap-10">
              {accounts.map((account) => (
                <AccountCard key={account.id} account={account} />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </>
  );
};

export default Accounts;
