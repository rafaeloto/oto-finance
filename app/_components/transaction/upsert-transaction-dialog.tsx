"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ExpenseForm from "./forms/expense-form";
import { Account } from "@prisma/client";

interface UpsertTransactionDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValues?: any;
  transactionId?: string;
  accounts?: Account[];
}

const UpsertTransactionDialog = ({
  isOpen,
  setIsOpen,
  defaultValues,
  transactionId,
  accounts,
}: UpsertTransactionDialogProps) => {
  const isUpdate = !!transactionId;

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

        <Tabs defaultValue="expense">
          <TabsList>
            <TabsTrigger value="expense">Despesa</TabsTrigger>
            <TabsTrigger value="gain">Receita</TabsTrigger>
            <TabsTrigger value="transfer">Transferência</TabsTrigger>
            <TabsTrigger value="investment">Investimento</TabsTrigger>
          </TabsList>

          <TabsContent value="expense">
            <ExpenseForm
              defaultValues={defaultValues}
              transactionId={transactionId}
              accounts={accounts}
              setIsOpen={setIsOpen}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UpsertTransactionDialog;