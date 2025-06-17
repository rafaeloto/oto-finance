"use client";

import SelectFilter from "@molecules/SelectFilter";
import { getValidDateFromParams } from "@utils/date";
import { getMonthsOptions, getYearsOptions } from "@utils/select";
import { useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

type TimeFilter = {
  month?: string;
  year?: string;
};

type TimeSelectProps<T extends TimeFilter> = {
  filters?: T;
  setFilters?: Dispatch<SetStateAction<T>>;
  className?: string;
  isInsideModal?: boolean;
};

const TimeSelect = <T extends TimeFilter>({
  filters,
  setFilters,
  className,
  isInsideModal = false,
}: TimeSelectProps<T>) => {
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
            setFilters((prev: T) => ({ ...prev, month: value ?? "" }) as T),
        })}
        className={className}
        hideClearButton
        isInsideModal={isInsideModal}
      />

      <SelectFilter
        paramKey="year"
        options={yearOptions}
        placeholder="Ano"
        value={filters?.year || validYear}
        {...(hasFilters && {
          onChange: (value) =>
            setFilters((prev: T) => ({ ...prev, year: value ?? "" }) as T),
        })}
        className={className}
        hideClearButton
        isInsideModal={isInsideModal}
      />
    </>
  );
};

export default TimeSelect;
