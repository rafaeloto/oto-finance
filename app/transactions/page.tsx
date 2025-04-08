import AddTransactionButton from "@components/transaction/AddTransactionButton";
import Navbar from "@molecules/Navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ScrollArea } from "../_components/ui/scroll-area";
import { canUserAddTransaction } from "../_data/can-user-add-transaction";
import EmptyListFeedback from "@atoms/EmptyListFeedback";
import { getCreditCards } from "../_data/get-credit-cards";
import { TransactionsTable } from "./_table";
import { getAccounts } from "../_data/get-accounts";
import { getInvoices } from "../_data/get-invoices";
import TransactionFilters from "./_filters";
import {
  getTransactions,
  type getTransactionsParams,
} from "../_data/get-transactions";
import { validateSearchParams } from "./_filters/validateFilters";

type PageProps = {
  searchParams: getTransactionsParams;
};

const TransactionsPage = async ({ searchParams }: PageProps) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const filters = validateSearchParams(searchParams);
  const transactions = await getTransactions(filters);
  const hasNoData = transactions.length === 0;

  const userCanAddTransaction = await canUserAddTransaction();
  const creditCards = await getCreditCards();
  const accounts = await getAccounts();
  const paidInvoices = await getInvoices({ status: "PAID" });

  return (
    <>
      <Navbar />

      <div className="flex h-screen flex-col space-y-6 overflow-hidden px-6 py-6 md:space-y-10 md:px-20 md:py-10">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">Transações</h1>
          <div className="flex gap-2">
            <TransactionFilters />
            <AddTransactionButton
              userCanAddTransaction={userCanAddTransaction}
            />
          </div>
        </div>

        {hasNoData ? (
          <EmptyListFeedback message="Nenhuma transação registrada" />
        ) : (
          <ScrollArea className="h-full">
            <TransactionsTable
              transactions={transactions}
              creditCards={creditCards}
              accounts={accounts}
              paidInvoices={paidInvoices}
            />
          </ScrollArea>
        )}
      </div>
    </>
  );
};

export default TransactionsPage;
