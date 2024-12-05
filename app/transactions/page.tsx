import { DataTable } from "../_components/ui/data-table";
import { transactionColumns } from "./_columns";
import { db } from "../_lib/prisma";
import AddTransactionButton from "../_components/transaction/add-transaction-button";
import Navbar from "../_components/navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ScrollArea } from "../_components/ui/scroll-area";
import { canUserAddTransaction } from "../_data/can-user-add-transaction";
import EmptyListFeedback from "../_components/empty-list-feedback";

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

  const hasNoData = transactions.length === 0;

  return (
    <>
      <Navbar />

      <div className="flex h-screen flex-col space-y-10 overflow-hidden px-20 py-10">
        {/* TÍTULO E BOTAO */}
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">Transações</h1>
          <AddTransactionButton userCanAddTransaction={userCanAddTransaction} />
        </div>

        {hasNoData ? (
          <EmptyListFeedback message="Nenhuma transação registrada" />
        ) : (
          <ScrollArea className="h-full">
            <DataTable
              columns={transactionColumns}
              data={JSON.parse(JSON.stringify(transactions))}
            />
          </ScrollArea>
        )}
      </div>
    </>
  );
};

export default TransactionsPage;
