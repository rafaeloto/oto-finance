"use client";

import { recalculateBalances } from "@actions/accounts/recalculateBalances";
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
} from "@shadcn/alert-dialog";
import { Button } from "@shadcn/button";
import Icon from "@atoms/Icon";
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
              <span className="hidden md:block">Recalculando...</span>
              <Icon name="Loader2" className="animate-spin" />
            </>
          ) : (
            <>
              <span className="hidden md:block">Recalcular saldos</span>
              <Icon name="Calculator" />
            </>
          )}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-[85%] max-w-lg">
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
