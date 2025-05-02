"use client";

import { useState } from "react";
import { Button } from "@shadcn/button";
import Icon from "@atoms/Icon";
import CreateCreditCardDialog from "./CreateCreditCardDialog";
import useIsDesktop from "@utils/useIsDesktop";

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
        <Icon name="CreditCard" />
      </Button>

      <CreateCreditCardDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
      />
    </>
  );
};

export default AddCreditCardButton;
