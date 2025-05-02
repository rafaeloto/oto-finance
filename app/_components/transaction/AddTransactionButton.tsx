"use client";

import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@shadcn/tooltip";
import Icon from "@atoms/Icon";
import useIsDesktop from "@utils/useIsDesktop";
import { TransactionType } from "@prisma/client";
import FloatingActionMenu from "@shadcn/floating-action-menu";
import UpsertTransactionDialog from "./UpsertTransactionDialog";

interface AddTransactionButtonProps {
  canUserAddTransaction?: boolean;
  short?: boolean;
}

const AddTransactionButton = ({
  canUserAddTransaction,
  short = false,
}: AddTransactionButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<TransactionType>("EXPENSE");

  const isDesktop = useIsDesktop();

  const handleOpenDialog = (type: TransactionType) => {
    if (!canUserAddTransaction) return;
    setDialogType(type);
    setIsDialogOpen(true);
  };

  const options = [
    {
      label: "Despesa",
      Icon: <Icon name="ArrowDown" className="h-4 w-4 text-red-500" />,
      onClick: () => handleOpenDialog("EXPENSE"),
    },
    {
      label: "Receita",
      Icon: <Icon name="DollarSign" className="h-4 w-4 text-green-500" />,
      onClick: () => handleOpenDialog("GAIN"),
    },
    {
      label: "Transferência",
      Icon: <Icon name="Repeat" className="h-4 w-4" />,
      onClick: () => handleOpenDialog("TRANSFER"),
    },
    {
      label: "Investimento",
      Icon: <Icon name="PiggyBank" className="h-4 w-4 text-yellow-400" />,
      onClick: () => handleOpenDialog("INVESTMENT"),
    },
  ];

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-block">
              <FloatingActionMenu
                options={options}
                className="rounded-full font-bold"
                disabled={!canUserAddTransaction}
                {...(!short && {
                  triggerLabel: isDesktop ? "Adicionar transação" : "Adicionar",
                })}
                {...(short && { size: "icon" })}
              />
            </span>
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
        type={dialogType}
      />
    </>
  );
};

export default AddTransactionButton;
