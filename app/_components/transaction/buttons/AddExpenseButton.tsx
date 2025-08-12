"use client";

import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@shadcn/tooltip";
import Icon from "@atoms/Icon";
import useIsDesktop from "@hooks/useIsDesktop";
import UpsertExpenseDialog from "@components/transaction/dialogs/UpsertExpenseDialog";
import { Button } from "@shadcn/button";
import ShouldRender from "@atoms/ShouldRender";

interface AddExpenseButtonProps {
  canUserAddTransaction?: boolean;
  short?: boolean;
}

const AddExpenseButton = ({
  canUserAddTransaction,
  short = false,
}: AddExpenseButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isDesktop = useIsDesktop();

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-block">
              <Button
                className="rounded-full font-bold"
                onClick={() => setIsDialogOpen(true)}
                disabled={!canUserAddTransaction}
                {...(short && { size: "icon" })}
              >
                <ShouldRender if={!short}>
                  {isDesktop ? "Adicionar despesa" : "Adicionar"}
                </ShouldRender>
                <Icon name="Plus" />
              </Button>
            </span>
          </TooltipTrigger>

          <TooltipContent>
            {!canUserAddTransaction &&
              "Você atingiu o limite de transações. Atualize seu plano para criar transações ilimitadas."}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <UpsertExpenseDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
    </>
  );
};

export default AddExpenseButton;
