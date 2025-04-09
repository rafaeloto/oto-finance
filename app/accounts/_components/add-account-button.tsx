"use client";

import { useState } from "react";
import { Button } from "@shadcn/button";
import { LandmarkIcon } from "lucide-react";
import CreateAccountDialog from "./create-account-dialog";

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

      <CreateAccountDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
    </>
  );
};

export default AddAccountButton;
