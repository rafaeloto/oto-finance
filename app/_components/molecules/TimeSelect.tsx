"use client";

import SelectFilter from "@molecules/SelectFilter";
import { getValidDateFromParams } from "@utils/date";
import { getMonthsOptions, getYearsOptions } from "@utils/select";
import type { TransactionFilters } from "@/app/transactions/_filters/TransactionFilterDialog";
import { useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

type TimeSelectProps = {
  filters?: { month?: string; year?: string };
  setFilters?: Dispatch<SetStateAction<TransactionFilters>>;
  className?: string;
};

const TimeSelect = ({ filters, setFilters, className }: TimeSelectProps) => {
  const searchParams = useSearchParams();

  const paramsMonth = searchParams.get("month")?.padStart(2, "0");
  const paramsYear = searchParams.get("year");
  const { validMonth, validYear } = getValidDateFromParams(
    paramsMonth!,
    paramsYear!,
  );

  const monthOptions = getMonthsOptions();
  const yearOptions = getYearsOptions().map((year) => ({
    label: year,
    value: year,
  }));

  const hasFilters = !!filters && !!setFilters;

  return (
    <>
      <SelectFilter
        paramKey="month"
        options={monthOptions}
        placeholder="Mês"
        value={filters?.month || validMonth}
        {...(hasFilters && {
          onChange: (value) =>
            setFilters((prev) => ({ ...prev, month: value ?? "" })),
        })}
        className={className}
      />

      <SelectFilter
        paramKey="year"
        options={yearOptions}
        placeholder="Ano"
        value={filters?.year || validYear}
        {...(hasFilters && {
          onChange: (value) =>
            setFilters((prev) => ({ ...prev, year: value ?? "" })),
        })}
        className={className}
      />
    </>
  );
};

export default TimeSelect;
