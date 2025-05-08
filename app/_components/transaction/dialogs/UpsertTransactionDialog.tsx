"use client";

import { Category, Transaction, TransactionType } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@shadcn/dialog";
import ExpenseForm from "@components/transaction/forms/ExpenseForm";
import GainForm from "@components/transaction/forms/GainForm";
import TransferForm from "@components/transaction/forms/TransferForm";
import InvestmentForm from "@components/transaction/forms/InvestmentForm";
import { ScrollArea } from "@shadcn/scroll-area";
import { TRANSACTION_TYPE_LABELS } from "@constants/transaction";
import UpsertCategoryDialog from "@components/category/UpsertCategoryDialog";
import { useState } from "react";
import { openCategoryDialogProps } from "@components/category/CategoryField";

const formComponents: Partial<
  Record<
    TransactionType,
    React.ComponentType<{
      transaction?: Transaction;
      setIsOpen: (open: boolean) => void;
      openCategoryDialog: (props: openCategoryDialogProps) => void;
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

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [category, setCategory] = useState<Category | undefined>();
  const [parentCategory, setParentCategory] = useState<Category | undefined>();

  const openCategoryDialog = ({
    category,
    parent,
  }: openCategoryDialogProps) => {
    setCategory(category);
    setParentCategory(parent);
    setCategoryDialogOpen(true);
  };

  return (
    <>
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
              <FormComponent
                transaction={transaction}
                setIsOpen={setIsOpen}
                openCategoryDialog={openCategoryDialog}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                Formulário não disponível para este tipo.
              </p>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <UpsertCategoryDialog
        key={`${type}-${parentCategory?.id}-${category?.id}`}
        open={categoryDialogOpen}
        setIsOpen={setCategoryDialogOpen}
        type={type}
        parentCategory={parentCategory}
        initialCategory={category}
      />
    </>
  );
};

export default UpsertTransactionDialog;
