"use client";

import { TransactionType } from "@prisma/client";
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

interface UpsertTransactionDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValues?: any;
  transactionId?: string;
  transactionType?: TransactionType;
}

const UpsertTransactionDialog = ({
  isOpen,
  setIsOpen,
  defaultValues,
  transactionId,
  transactionType,
}: UpsertTransactionDialogProps) => {
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
              Receita
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
            <ExpenseForm
              defaultValues={defaultValues}
              transactionId={transactionId}
              setIsOpen={setIsOpen}
            />
          </TabsContent>

          <TabsContent value="gain">
            <GainForm
              defaultValues={defaultValues}
              transactionId={transactionId}
              setIsOpen={setIsOpen}
            />
          </TabsContent>

          <TabsContent value="transfer">
            <TransferForm
              defaultValues={defaultValues}
              transactionId={transactionId}
              setIsOpen={setIsOpen}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UpsertTransactionDialog;
