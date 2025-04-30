"use client";

import { Transaction, TransactionType } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@shadcn/dialog";
import ExpenseForm from "@components/transaction/forms/ExpenseForm";
import GainForm from "./forms/GainForm";
import TransferForm from "./forms/TransferForm";
import InvestmentForm from "./forms/InvestmentForm";
import { ScrollArea } from "@shadcn/scroll-area";
import { TRANSACTION_TYPE_LABELS } from "@/app/_constants/transaction";

const formComponents: Partial<
  Record<
    TransactionType,
    React.ComponentType<{
      transaction?: Transaction;
      setIsOpen: (open: boolean) => void;
    }>
  >
> = {
  GAIN: GainForm,
  EXPENSE: ExpenseForm,
  TRANSFER: TransferForm,
  INVESTMENT: InvestmentForm,
};

interface UpsertTransactionDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  transaction?: Transaction;
  type: TransactionType;
}

const UpsertTransactionDialog = ({
  isOpen,
  setIsOpen,
  transaction,
  type,
}: UpsertTransactionDialogProps) => {
  const isUpdate = !!transaction?.id;
  const FormComponent = formComponents[type];

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
            {isUpdate ? "Atualizar" : "Adicionar"}{" "}
            {TRANSACTION_TYPE_LABELS[type]}
          </DialogTitle>
          <DialogDescription>Insira as informações abaixo</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-full pr-5">
          {FormComponent ? (
            <FormComponent transaction={transaction} setIsOpen={setIsOpen} />
          ) : (
            <p className="text-sm text-muted-foreground">
              Formulário não disponível para este tipo.
            </p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default UpsertTransactionDialog;
