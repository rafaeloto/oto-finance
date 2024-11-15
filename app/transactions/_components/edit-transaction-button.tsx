"use client";

import { useState } from "react";
import { Button } from "@/app/_components/ui/button";
import { PencilIcon } from "lucide-react";
import UpsertTransactionDialog from "@/app/_components/upsert-transaction-dialog";
import { Transaction } from "@prisma/client";

interface EditTransactionButtonProps {
  transaction: Transaction;
}

const EditTransactionButton = ({ transaction }: EditTransactionButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    gainCategory,
    expenseCategory,
    investmentCategory,
    transferCategory,
    ...restTransaction
  } = transaction;

  const defaultValues = {
    ...restTransaction,
    amount: Number(transaction.amount),
    date: new Date(transaction.date),
    category:
      gainCategory ||
      expenseCategory ||
      investmentCategory ||
      transferCategory ||
      "",
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground"
        onClick={() => setIsDialogOpen(true)}
      >
        <PencilIcon />
      </Button>

      <UpsertTransactionDialog
        defaultValues={defaultValues}
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        transactionId={transaction.id}
      />
    </>
  );
};

export default EditTransactionButton;
