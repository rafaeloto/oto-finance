"use client";

import { recalculateBalances } from "@/app/_actions/accounts/recalculate-balances";
import { Button } from "@/app/_components/ui/button";
import { CalculatorIcon, LoaderCircleIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const RecalculateBalancesButton = () => {
  const [loading, setLoading] = useState(false);

  const handleRecalculate = async () => {
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
    <>
      <Button
        className="rounded-full font-bold"
        variant="destructive"
        disabled={loading}
        onClick={handleRecalculate}
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
    </>
  );
};

export default RecalculateBalancesButton;
