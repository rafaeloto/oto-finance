"use client";

import TimeSelect from "@molecules/TimeSelect";
import SwitchFilter from "@molecules/SwitchFilter";
import { Button } from "@shadcn/button";
import { cn } from "@/app/_lib/utils";
import Icon from "@atoms/Icon";
import { useState } from "react";
import DashboardFilterDialog from "./DashboardFilterDialog";
import { useSearchParams } from "next/navigation";
import LoanTooltip from "@molecules/LoanTooltip";

const DashboardFilter = () => {
  const [open, setOpen] = useState(false);

  const searchParams = useSearchParams();

  /**
   * Checks if any filter, except 'month' and 'year', is active
   */
  const hasActiveFilters = Array.from(searchParams.entries()).some(
    ([key, value]) => value && key !== "month" && key !== "year",
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden space-x-4 md:flex">
        <TimeSelect />
        <SwitchFilter paramKey="ignoreLoans" tooltip={<LoanTooltip />} />
      </div>

      {/* Mobile */}
      <div className="block md:hidden">
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "rounded-full",
            hasActiveFilters && "animate-pulse border-primary",
          )}
          onClick={() => setOpen(true)}
        >
          <Icon name="Filter" />
        </Button>

        <DashboardFilterDialog open={open} setOpen={setOpen} />
      </div>
    </>
  );
};

export default DashboardFilter;
