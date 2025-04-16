"use client";

import { useState } from "react";
import { Button } from "@shadcn/button";
import { PencilIcon } from "lucide-react";
import { Account } from "@prisma/client";
import { cn } from "@/app/_lib/utils";
import UpsertAccountDialog from "./UpsertAccountDialog";

interface EditAccountButtonProps {
  account: Account;
  noPadding?: boolean;
  className?: string;
}

const EditAccountButton = ({
  account,
  noPadding = false,
  className,
}: EditAccountButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className={className}>
      <Button
        variant="ghost"
        size={noPadding ? "sm" : "icon"}
        className={cn("text-muted-foreground", noPadding && "p-0")}
        onClick={() => setIsDialogOpen(true)}
      >
        <PencilIcon />
      </Button>

      <UpsertAccountDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        account={account}
      />
    </div>
  );
};

export default EditAccountButton;
