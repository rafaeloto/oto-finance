"use client";

import { useState } from "react";
import { Button } from "@/app/_components/ui/button";
import { CreditCardIcon } from "lucide-react";
import CreateCreditCardDialog from "./create-credit-card-dialog";

const AddCreditCardButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button
        className="rounded-full font-bold"
        onClick={() => setIsDialogOpen(true)}
      >
        Adicionar cartão de crédito
        <CreditCardIcon />
      </Button>

      <CreateCreditCardDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
      />
    </>
  );
};

export default AddCreditCardButton;
