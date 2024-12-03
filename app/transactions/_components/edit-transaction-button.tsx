"use client";

import { useState } from "react";
import { Button } from "@/app/_components/ui/button";
import { PencilIcon } from "lucide-react";
import { Transaction } from "@prisma/client";
import UpsertTransactionDialog from "@/app/_components/transaction/upsert-transaction-dialog";

interface EditTransactionButtonProps {
  transaction: Transaction;
}

const EditTransactionButton = ({ transaction }: EditTransactionButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const defaultValues = {
    ...transaction,
    amount: Number(transaction.amount),
    date: new Date(transaction.date),
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
