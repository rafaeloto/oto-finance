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
import ExpenseForm from "./forms/expense-form";
import GainForm from "./forms/gain-form";
import TransferForm from "./forms/transfer-form";
import InvestmentForm from "./forms/investment-form";

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isUpdate ? "Atualizar" : "Adicionar"} Transação
          </DialogTitle>
          <DialogDescription>Insira as informações abaixo</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={tabValueMap[transactionType || "EXPENSE"]}>
          <TabsList>
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

          <TabsContent value="expense">
            <ExpenseForm setIsOpen={setIsOpen} transaction={transaction} />
          </TabsContent>

          <TabsContent value="gain">
            <GainForm setIsOpen={setIsOpen} transaction={transaction} />
          </TabsContent>

          <TabsContent value="transfer">
            <TransferForm setIsOpen={setIsOpen} transaction={transaction} />
          </TabsContent>

          <TabsContent value="investment">
            <InvestmentForm setIsOpen={setIsOpen} transaction={transaction} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UpsertTransactionDialog;
