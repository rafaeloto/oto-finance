"use client";

import { useState } from "react";
import { Button } from "@shadcn/button";
import Icon from "@atoms/Icon";
import { Transaction } from "@prisma/client";
import { cn } from "@/app/_lib/utils";
import UpsertTransactionDialog from "@components/transaction/UpsertTransactionDialog";

interface EditTransactionButtonProps {
  transaction: Transaction;
  noPadding?: boolean;
}

const EditTransactionButton = ({
  transaction,
  noPadding = false,
}: EditTransactionButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size={noPadding ? "sm" : "icon"}
        className={cn("text-muted-foreground", noPadding && "p-0")}
        onClick={() => setIsDialogOpen(true)}
      >
        <Icon name="Pencil" />
      </Button>

      <UpsertTransactionDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        type={transaction.type}
        transaction={transaction}
      />
    </>
  );
};

export default EditTransactionButton;
