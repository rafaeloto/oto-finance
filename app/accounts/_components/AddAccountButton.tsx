"use client";

import { useState } from "react";
import { Button } from "@shadcn/button";
import Icon from "@atoms/Icon";
import UpsertAccountDialog from "./UpsertAccountDialog";

const AddAccountButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button
        className="rounded-full font-bold"
        onClick={() => setIsDialogOpen(true)}
      >
        Adicionar conta
        <Icon name="Landmark" />
      </Button>

      <UpsertAccountDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
    </>
  );
};

export default AddAccountButton;
