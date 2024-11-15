import Navbar from "../_components/navbar";
import AddAccountButton from "./_components/add-account-button";

const Accounts = () => {
  return (
    <>
      <Navbar />

      <div className="flex flex-col space-y-6 overflow-hidden p-6">
        {/* TÍTULO E BOTAO */}
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">Contas</h1>
          <AddAccountButton />
        </div>

        {/* <ScrollArea className="h-full">
          <DataTable
            columns={transactionColumns}
            data={JSON.parse(JSON.stringify(transactions))}
          />
        </ScrollArea> */}
      </div>
    </>
  );
};

export default Accounts;
