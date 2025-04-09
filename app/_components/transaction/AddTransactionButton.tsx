"use client";

import { useState } from "react";
import { Button } from "@shadcn/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@shadcn/tooltip";
import UpsertTransactionDialog from "@components/transaction/UpsertTransactionDialog";
import { ArrowDownUpIcon } from "lucide-react";
import useIsDesktop from "@/app/_utils/useIsDesktop";

interface AddTransactionButtonProps {
  userCanAddTransaction?: boolean;
}

const AddTransactionButton = ({
  userCanAddTransaction,
}: AddTransactionButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isDesktop = useIsDesktop();

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
              {isDesktop ? "Adicionar transação" : "Adicionar"}
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
      />
    </>
  );
};

export default AddTransactionButton;
