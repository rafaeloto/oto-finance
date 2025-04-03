"use client";

import { Transaction } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ExpenseForm from "./forms/ExpenseForm";
import GainForm from "./forms/GainForm";
import TransferForm from "./forms/TransferForm";
import InvestmentForm from "./forms/InvestmentForm";
import { ScrollArea } from "../ui/scroll-area";

interface UpsertTransactionDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  transaction?: Transaction;
}

const UpsertTransactionDialog = ({
  isOpen,
  setIsOpen,
  transaction,
}: UpsertTransactionDialogProps) => {
  const { id: transactionId, type: transactionType } = transaction || {};
  const isUpdate = !!transactionId;

  const tabValueMap = {
    EXPENSE: "expense",
    GAIN: "gain",
    TRANSFER: "transfer",
    INVESTMENT: "investment",
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <DialogContent className="flex h-[85svh] w-[95svw] max-w-lg flex-col py-8 pr-1">
        <DialogHeader>
          <DialogTitle>
            {isUpdate ? "Atualizar" : "Adicionar"} Transação
          </DialogTitle>
          <DialogDescription>Insira as informações abaixo</DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue={tabValueMap[transactionType || "EXPENSE"]}
          className="flex h-0 flex-1 flex-col"
        >
          <TabsList className="mr-5 flex h-12 justify-between overflow-x-auto whitespace-nowrap px-2 md:px-5">
            <TabsTrigger
              value="expense"
              disabled={isUpdate && transactionType !== "EXPENSE"}
            >
              Despesa
            </TabsTrigger>

            <TabsTrigger
              value="gain"
              disabled={isUpdate && transactionType !== "GAIN"}
            >
              Ganho
            </TabsTrigger>

            <TabsTrigger
              value="transfer"
              disabled={isUpdate && transactionType !== "TRANSFER"}
            >
              Transferência
            </TabsTrigger>

            <TabsTrigger
              value="investment"
              disabled={isUpdate && transactionType !== "INVESTMENT"}
            >
              Investimento
            </TabsTrigger>
          </TabsList>

          <TabsContent value="expense" className="mt-5 h-0 flex-1">
            <ScrollArea className="h-full pr-5">
              <ExpenseForm setIsOpen={setIsOpen} transaction={transaction} />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="gain" className="mt-5 h-0 flex-1">
            <ScrollArea className="h-full pr-5">
              <GainForm setIsOpen={setIsOpen} transaction={transaction} />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="transfer" className="mt-5 h-0 flex-1">
            <ScrollArea className="h-full pr-5">
              <TransferForm setIsOpen={setIsOpen} transaction={transaction} />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="investment" className="mt-5 h-0 flex-1">
            <ScrollArea className="h-full pr-5">
              <InvestmentForm setIsOpen={setIsOpen} transaction={transaction} />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UpsertTransactionDialog;
