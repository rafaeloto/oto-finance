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
import { TransactionType } from "@prisma/client";
import FloatingActionMenu from "@shadcn/floating-action-menu";
import UpsertTransactionDialog from "@components/transaction/dialogs/UpsertTransactionDialog";
import CreditReturnDialog from "@components/transaction/dialogs/CreditReturnDialog";

interface AddTransactionButtonProps {
  canUserAddTransaction?: boolean;
  short?: boolean;
  visibleOptions?: (
    | "EXPENSE"
    | "GAIN"
    | "TRANSFER"
    | "INVESTMENT"
    | "RETURN"
  )[];
}

const AddTransactionButton = ({
  canUserAddTransaction,
  short = false,
  visibleOptions = ["EXPENSE", "GAIN", "TRANSFER", "INVESTMENT"],
}: AddTransactionButtonProps) => {
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<TransactionType>("EXPENSE");
  const [isCreditReturnDialogOpen, setIsCreditReturnDialogOpen] =
    useState(false);

  const isDesktop = useIsDesktop();

  const handleOpenDialog = (type: TransactionType) => {
    if (!canUserAddTransaction) return;
    setDialogType(type);
    setIsTransactionDialogOpen(true);
  };

  const handleOpenCreditReturnDialog = () => {
    if (!canUserAddTransaction) return;
    setIsCreditReturnDialogOpen(true);
  };

  const allOptions = [
    {
      id: "EXPENSE" as const,
      label: "Despesa",
      Icon: <Icon name="ArrowDown" className="h-4 w-4 text-red-500" />,
      onClick: () => handleOpenDialog("EXPENSE"),
    },
    {
      id: "GAIN" as const,
      label: "Receita",
      Icon: <Icon name="DollarSign" className="h-4 w-4 text-green-500" />,
      onClick: () => handleOpenDialog("GAIN"),
    },
    {
      id: "TRANSFER" as const,
      label: "Transferência",
      Icon: <Icon name="Repeat" className="h-4 w-4" />,
      onClick: () => handleOpenDialog("TRANSFER"),
    },
    {
      id: "INVESTMENT" as const,
      label: "Investimento",
      Icon: <Icon name="PiggyBank" className="h-4 w-4 text-yellow-400" />,
      onClick: () => handleOpenDialog("INVESTMENT"),
    },
    {
      id: "RETURN" as const,
      label: "Devolução",
      Icon: <Icon name="ArrowUp" className="h-4 w-4 text-green-600" />,
      onClick: handleOpenCreditReturnDialog,
    },
  ];

  const options = allOptions.filter((option) =>
    visibleOptions.includes(option.id),
  );

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
        isOpen={isTransactionDialogOpen}
        setIsOpen={setIsTransactionDialogOpen}
        type={dialogType}
      />

      <CreditReturnDialog
        isOpen={isCreditReturnDialogOpen}
        setIsOpen={setIsCreditReturnDialogOpen}
      />
    </>
  );
};

export default AddTransactionButton;
