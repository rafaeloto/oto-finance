"use client";

import { Transaction } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@shadcn/dialog";
import ExpenseForm from "@components/transaction/forms/ExpenseForm";
import { ScrollArea } from "@shadcn/scroll-area";

interface UpsertExpenseDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  transaction?: Transaction;
}

const UpsertExpenseDialog = ({
  isOpen,
  setIsOpen,
  transaction,
}: UpsertExpenseDialogProps) => {
  const isUpdate = !!transaction?.id;

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
            {isUpdate ? "Atualizar" : "Adicionar"} Despesa
          </DialogTitle>
          <DialogDescription>Insira as informações abaixo</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-full pr-5">
          <ExpenseForm transaction={transaction} setIsOpen={setIsOpen} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default UpsertExpenseDialog;
