import { DataTable } from "../_components/ui/data-table";
import { getTransactionColumns } from "./_columns";
import { db } from "../_lib/prisma";
import AddTransactionButton from "../_components/transaction/add-transaction-button";
import Navbar from "../_components/navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ScrollArea } from "../_components/ui/scroll-area";
import { canUserAddTransaction } from "../_data/can-user-add-transaction";
import EmptyListFeedback from "../_components/empty-list-feedback";
import { getAccounts } from "../_data/get-accounts";

const TransactionsPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const transactions = await db.transaction.findMany({
    where: {
      userId,
    },
    orderBy: {
      date: "desc",
    },
  });

  const userCanAddTransaction = await canUserAddTransaction();

  const accounts = await getAccounts();

  const hasNoData = transactions.length === 0;

  return (
    <>
      <Navbar />

      <div className="flex flex-col space-y-6 overflow-hidden p-6">
        {/* TÍTULO E BOTAO */}
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">Transações</h1>
          <AddTransactionButton
            userCanAddTransaction={userCanAddTransaction}
            accounts={accounts}
          />
        </div>

        {hasNoData ? (
          <EmptyListFeedback message="Nenhuma transação registrada" />
        ) : (
          <ScrollArea className="h-full">
            <DataTable
              columns={getTransactionColumns(accounts)}
              data={JSON.parse(JSON.stringify(transactions))}
            />
          </ScrollArea>
        )}
      </div>
    </>
  );
};

export default TransactionsPage;
