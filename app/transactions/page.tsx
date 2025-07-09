import AddTransactionButton from "@components/transaction/buttons/AddTransactionButton";
import Navbar from "@molecules/Navbar";
import { ScrollArea } from "@shadcn/scroll-area";
import { getCanUserAddTransaction } from "@data/getCanUserAddTransaction";
import EmptyListFeedback from "@atoms/EmptyListFeedback";
import { getCreditCards } from "@data/getCreditCards";
import { TransactionsTable } from "./_table";
import { getAccounts } from "@data/getAccounts";
import { getInvoices } from "@data/getInvoices";
import TransactionFilters from "./_filters";
import {
  getTransactions,
  type getTransactionsParams,
} from "@data/getTransactions";
import { validateSearchParams } from "./_filters/validateFilters";
import { getCategories } from "@data/getCategories";

type PageProps = {
  searchParams: getTransactionsParams;
};

const TransactionsPage = async ({ searchParams }: PageProps) => {
  const filters = validateSearchParams(searchParams);
  const transactions = await getTransactions(filters);
  const hasNoData = transactions.length === 0;

  const canUserAddTransaction = await getCanUserAddTransaction();
  const creditCards = await getCreditCards();
  const accounts = await getAccounts();
  const categories = await getCategories({});
  const paidInvoices = await getInvoices({ status: "PAID" });

  return (
    <>
      <Navbar />

      <div className="flex h-screen flex-col space-y-6 overflow-hidden px-6 py-6 md:space-y-10 md:px-10 md:py-10">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">Transações</h1>
          <div className="flex gap-2">
            <TransactionFilters />
            <AddTransactionButton
              canUserAddTransaction={canUserAddTransaction}
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
              categories={categories}
              paidInvoices={paidInvoices}
            />
          </ScrollArea>
        )}
      </div>
    </>
  );
};

export default TransactionsPage;
