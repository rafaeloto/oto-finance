"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { getValidDateFromParams } from "@/app/_utils/date";
import { getMonthsOptions, getYearsOptions } from "@/app/_utils/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const TimeSelect = () => {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const paramsMonth = searchParams.get("month")?.padStart(2, "0");
  const paramsYear = searchParams.get("year");

  const { validMonth, validYear } = getValidDateFromParams(
    paramsMonth!,
    paramsYear!,
  );

  const [selectedMonth, setSelectedMonth] = useState(validMonth);
  const [selectedYear, setSelectedYear] = useState(validYear);

  const monthOptions = getMonthsOptions();
  const yearOptions = getYearsOptions();

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    push(`/?month=${month}&year=${selectedYear}`);
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    push(`/?month=${selectedMonth}&year=${year}`);
  };

  useEffect(() => {
    setSelectedMonth(validMonth);
  }, [validMonth]);

  useEffect(() => {
    setSelectedYear(validYear);
  }, [validYear]);

  return (
    <>
      <Select
        onValueChange={(value) => handleMonthChange(value)}
        value={selectedMonth}
      >
        <SelectTrigger className="w-[150px] rounded-full">
          <SelectValue placeholder="Mês" />
        </SelectTrigger>

        <SelectContent>
          {monthOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={(value) => handleYearChange(value)}
        value={selectedYear}
      >
        <SelectTrigger className="w-[150px] rounded-full">
          <SelectValue placeholder="Ano" />
        </SelectTrigger>

        <SelectContent>
          {yearOptions.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};

export default TimeSelect;
