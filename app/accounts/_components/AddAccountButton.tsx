"use client";

import { useState } from "react";
import { Button } from "@shadcn/button";
import { LandmarkIcon } from "lucide-react";
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
        <LandmarkIcon />
      </Button>

      <UpsertAccountDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
    </>
  );
};

export default AddAccountButton;
