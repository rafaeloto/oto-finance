"use client";

import { recalculateBalances } from "@/app/_actions/accounts/recalculate-balances";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/_components/ui/alert-dialog";
import { Button } from "@/app/_components/ui/button";
import { CalculatorIcon, LoaderCircleIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const RecalculateBalancesButton = () => {
  const [loading, setLoading] = useState(false);

  const handleConfirmRecalculate = async () => {
    setLoading(true);

    try {
      await recalculateBalances();
      toast.success("Saldos recalculados com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao recalcular saldos!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="rounded-full font-bold"
          variant="destructive"
          disabled={loading}
        >
          {loading ? (
            <>
              <span>Recalculando...</span>
              <LoaderCircleIcon className="animate-spin" />
            </>
          ) : (
            <>
              <span>Recalcular saldos</span>
              <CalculatorIcon />
            </>
          )}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Você deseja realmente recalcular os saldos?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita. Irá recalcular e sobrescrever
            permanentemente os saldos das contas nos nossos servidores.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmRecalculate}>
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RecalculateBalancesButton;
