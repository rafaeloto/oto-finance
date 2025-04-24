"use client";

import { cn } from "@/app/_lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shadcn/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@shadcn/button";
import { XIcon } from "lucide-react";
import ShouldRender from "@atoms/ShouldRender";

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
  className?: string;
  hideClearButton?: boolean;
  isInsideModal?: boolean;
};

const SelectFilter = ({
  paramKey,
  options,
  placeholder,
  value,
  onChange,
  className,
  hideClearButton = false,
  isInsideModal = false,
}: SelectFilterProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [selectedValue, setSelectedValue] = useState(
    value || searchParams.get(paramKey) || undefined,
  );

  useEffect(() => {
    if (isInsideModal) return;
    setSelectedValue(value || searchParams.get(paramKey) || undefined);
  }, [isInsideModal, value, searchParams, paramKey]);

  const handleFilterChange = (value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      setSelectedValue(value);
      if (onChange) return onChange(value);
      params.set(paramKey, value);
    } else {
      setSelectedValue(undefined);
      if (onChange) return onChange(value);
      params.delete(paramKey);
    }

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-0">
      <Select
        onValueChange={handleFilterChange}
        value={selectedValue ?? ""}
        disabled={!options.length}
      >
        <SelectTrigger
          className={cn("min-w-fit space-x-2 md:rounded-full", className)}
        >
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

      <ShouldRender if={!!selectedValue && !hideClearButton}>
        <Button
          variant="ghost"
          size="icon"
          className="p-0 hover:scale-110 hover:bg-transparent"
          onClick={() => handleFilterChange(undefined)}
        >
          <XIcon />
        </Button>
      </ShouldRender>
    </div>
  );
};

export default SelectFilter;
