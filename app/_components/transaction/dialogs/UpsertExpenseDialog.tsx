"use client";

import { Category, Transaction } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@shadcn/dialog";
import ExpenseForm from "@components/transaction/forms/ExpenseForm";
import { ScrollArea } from "@shadcn/scroll-area";
import UpsertCategoryDialog from "@components/category/UpsertCategoryDialog";
import { useState } from "react";
import { openCategoryDialogProps } from "@components/category/CategoryField";

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
              {isUpdate ? "Atualizar" : "Adicionar"} Despesa
            </DialogTitle>
            <DialogDescription>Insira as informações abaixo</DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-full pr-5">
            <ExpenseForm
              transaction={transaction}
              setIsOpen={setIsOpen}
              openCategoryDialog={openCategoryDialog}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <UpsertCategoryDialog
        key={`EXPENSE-${parentCategory?.id}-${category?.id}`}
        open={categoryDialogOpen}
        setIsOpen={setCategoryDialogOpen}
        type="EXPENSE"
        parentCategory={parentCategory}
        initialCategory={category}
      />
    </>
  );
};

export default UpsertExpenseDialog;
