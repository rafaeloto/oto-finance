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
import { ArrowDownUpIcon, PlusIcon } from "lucide-react";
import useIsDesktop from "@utils/useIsDesktop";
import ShouldRender from "@atoms/ShouldRender";

interface AddTransactionButtonProps {
  canUserAddTransaction?: boolean;
  short?: boolean;
}

const AddTransactionButton = ({
  canUserAddTransaction,
  short = false,
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
              disabled={!canUserAddTransaction}
              {...(short && { size: "icon" })}
            >
              <ShouldRender if={short}>
                <PlusIcon />
              </ShouldRender>
              <ShouldRender if={!short}>
                {isDesktop ? "Adicionar transação" : "Adicionar"}
                <ArrowDownUpIcon />
              </ShouldRender>
            </Button>
          </TooltipTrigger>

          <TooltipContent>
            {!canUserAddTransaction &&
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
