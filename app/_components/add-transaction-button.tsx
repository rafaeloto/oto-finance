"use client";

import { useState } from "react";
import UpsertTransactionDialog from "./upsert-transaction-dialog";
import { Button } from "./ui/button";
import { ArrowDownUpIcon } from "lucide-react";

const AddTransactionButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button
        className="rounded-full font-bold"
        onClick={() => setIsDialogOpen(true)}
      >
        Adicionar Transação
        <ArrowDownUpIcon />
      </Button>

      <UpsertTransactionDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
      />
    </>
  );
};

export default AddTransactionButton;
