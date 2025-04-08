"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Option = {
  label: React.ReactNode;
  value: string;
};

type SelectFilterProps = {
  paramKey: string;
  options: Option[];
  placeholder: string;
  value?: string;
  onChange?: (value: string | undefined) => void;
};

const SelectFilter = ({
  paramKey,
  options,
  placeholder,
  value,
  onChange,
}: SelectFilterProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [selectedValue, setSelectedValue] = useState(
    value || searchParams.get(paramKey) || undefined,
  );

  useEffect(() => {
    setSelectedValue(value || searchParams.get(paramKey) || undefined);
  }, [value, searchParams, paramKey]);

  const handleFilterChange = (value: string | undefined) => {
    if (onChange) return onChange(value);

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
      value={selectedValue ?? ""}
      disabled={!options.length}
    >
      <SelectTrigger className="min-w-fit space-x-2 md:rounded-full">
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
