"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@shadcn/dialog";
import CreditReturnForm from "@components/transaction/forms/CreditReturnForm";
import { ScrollArea } from "@shadcn/scroll-area";
import UpsertCategoryDialog from "@components/category/UpsertCategoryDialog";
import { useState } from "react";
import { openCategoryDialogProps } from "@components/category/CategoryField";
import { Category } from "@prisma/client";

interface CreditReturnDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CreditReturnDialog = ({ isOpen, setIsOpen }: CreditReturnDialogProps) => {
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
            <DialogTitle>Adicionar Devolução</DialogTitle>
            <DialogDescription>
              Insira as informações da devolução abaixo
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-full pr-5">
            <CreditReturnForm
              setIsOpen={setIsOpen}
              openCategoryDialog={openCategoryDialog}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <UpsertCategoryDialog
        key={`credit-return-${parentCategory?.id}-${category?.id}`}
        open={categoryDialogOpen}
        setIsOpen={setCategoryDialogOpen}
        type="GAIN"
        parentCategory={parentCategory}
        initialCategory={category}
      />
    </>
  );
};

export default CreditReturnDialog;
