"use client";

import SelectFilter from "@/app/_components/_molecules/SelectFilter";
import { getValidDateFromParams } from "@/app/_utils/date";
import { getMonthsOptions, getYearsOptions } from "@/app/_utils/select";
import { useSearchParams } from "next/navigation";

const TimeSelect = () => {
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

  return (
    <>
      <SelectFilter
        paramKey="month"
        options={monthOptions}
        placeholder="Mês"
        defaultValue={validMonth}
      />

      <SelectFilter
        paramKey="year"
        options={yearOptions}
        placeholder="Ano"
        defaultValue={validYear}
      />
    </>
  );
};

export default TimeSelect;
