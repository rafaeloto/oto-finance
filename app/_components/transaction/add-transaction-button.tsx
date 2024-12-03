"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import UpsertTransactionDialog from "./upsert-transaction-dialog";
import { ArrowDownUpIcon } from "lucide-react";
import { Account } from "@prisma/client";

interface AddTransactionButtonProps {
  userCanAddTransaction?: boolean;
  accounts?: Account[];
}

const AddTransactionButton = (props: AddTransactionButtonProps) => {
  const { userCanAddTransaction, accounts } = props;

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="rounded-full font-bold"
              onClick={() => setIsDialogOpen(true)}
              disabled={!userCanAddTransaction}
            >
              Adicionar transação
              <ArrowDownUpIcon />
            </Button>
          </TooltipTrigger>

          <TooltipContent>
            {!userCanAddTransaction &&
              "Você atingiu o limite de transações. Atualize seu plano para criar transações ilimitadas."}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <UpsertTransactionDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        accounts={accounts}
      />
    </>
  );
};

export default AddTransactionButton;
