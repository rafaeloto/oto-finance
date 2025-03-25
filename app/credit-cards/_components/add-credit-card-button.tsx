"use client";

import { useState } from "react";
import { Button } from "@/app/_components/ui/button";
import { CreditCardIcon } from "lucide-react";
import CreateCreditCardDialog from "./create-credit-card-dialog";
import useIsDesktop from "@/app/_utils/useIsDesktop";

const AddCreditCardButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isDesktop = useIsDesktop();

  return (
    <>
      <Button
        className="rounded-full font-bold"
        onClick={() => setIsDialogOpen(true)}
      >
        {`Adicionar${isDesktop ? " cartão de crédito" : ""}`}
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
