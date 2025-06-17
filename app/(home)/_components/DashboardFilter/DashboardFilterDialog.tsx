"use client";

import { Button } from "@shadcn/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shadcn/dialog";
import { useSearchParams, useRouter } from "next/navigation";
import TimeSelect from "@molecules/TimeSelect";
import { useState, useEffect } from "react";
import SwitchFilter from "@molecules/SwitchFilter";

export type DashboardFilters = {
  month: string;
  year: string;
  ignoreLoans: boolean;
};

type DashboardFilterDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DashboardFilterDialog = ({
  open,
  setOpen,
}: DashboardFilterDialogProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState<DashboardFilters>({
    month: "",
    year: "",
    ignoreLoans: false,
  });

  // Fills the filters with the URL values when opening the modal
  useEffect(() => {
    if (open) {
      setFilters({
        month: searchParams.get("month") || "",
        year: searchParams.get("year") || "",
        ignoreLoans: searchParams.get("ignoreLoans") === "true",
      });
    }
  }, [open, searchParams]);

  const applyFilters = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value.toString());
    });
    router.push(`?${params.toString()}`);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[95svw] max-w-lg">
        <DialogHeader>
          <DialogTitle>Filtros</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <TimeSelect<DashboardFilters>
            filters={filters}
            setFilters={setFilters}
            isInsideModal
          />

          <SwitchFilter
            paramKey="ignoreLoans"
            value={filters.ignoreLoans}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, ignoreLoans: value }))
            }
            isInsideModal
          />
        </div>

        <DialogFooter className="flex gap-3 md:gap-0">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>

          <Button onClick={applyFilters}>Aplicar filtros</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardFilterDialog;
