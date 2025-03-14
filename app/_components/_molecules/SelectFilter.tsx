"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Option = {
  label: React.ReactNode;
  value: string;
};

type SelectFilterProps = {
  paramKey: string;
  options: Option[];
  placeholder: string;
  defaultValue?: string;
};

const SelectFilter = ({
  paramKey,
  options,
  placeholder,
  defaultValue,
}: SelectFilterProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [selectedValue, setSelectedValue] = useState(
    defaultValue || searchParams.get(paramKey) || undefined,
  );

  const handleFilterChange = (value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      setSelectedValue(value);
      params.set(paramKey, value);
    } else {
      setSelectedValue(undefined);
      params.delete(paramKey);
    }

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Select
      onValueChange={handleFilterChange}
      value={selectedValue}
      disabled={!options.length}
    >
      <SelectTrigger className="min-w-fit space-x-2 rounded-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectFilter;
