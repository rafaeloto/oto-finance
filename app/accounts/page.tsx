import { auth } from "@clerk/nextjs/server";
import Navbar from "../_components/navbar";
import { ScrollArea } from "../_components/ui/scroll-area";
import AddAccountButton from "./_components/add-account-button";
import { redirect } from "next/navigation";
import { db } from "../_lib/prisma";
import AccountCard from "./_components/account-card";
import EmptyListFeedback from "../_components/empty-list-feedback";

const Accounts = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const accounts = await db.account.findMany({
    where: {
      userId,
    },
  });

  const hasNoData = accounts.length === 0;

  return (
    <>
      <Navbar />

      <div className="flex flex-col space-y-6 overflow-hidden p-6">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">Contas</h1>
          <AddAccountButton />
        </div>

        {hasNoData ? (
          <EmptyListFeedback message="Nenhuma conta registrada" />
        ) : (
          <ScrollArea className="h-full">
            <div className="flex justify-center">
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {accounts.map((account) => (
                  <AccountCard key={account.id} account={account} />
                ))}
              </div>
            </div>
          </ScrollArea>
        )}
      </div>
    </>
  );
};

export default Accounts;
