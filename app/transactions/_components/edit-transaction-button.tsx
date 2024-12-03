"use client";

import { useState } from "react";
import { Button } from "@/app/_components/ui/button";
import { PencilIcon } from "lucide-react";
import { Account, Transaction } from "@prisma/client";
import UpsertTransactionDialog from "@/app/_components/transaction/upsert-transaction-dialog";

interface EditTransactionButtonProps {
  transaction: Transaction;
  accounts?: Account[];
}

const EditTransactionButton = ({
  transaction,
  accounts,
}: EditTransactionButtonProps) => {
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
        accounts={accounts}
      />
    </>
  );
};

export default EditTransactionButton;
