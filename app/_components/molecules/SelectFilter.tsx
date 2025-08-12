"use client";

import { cn } from "@/app/_lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shadcn/select";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "@hooks/useRouter";
import { useEffect, useState } from "react";
import { Button } from "@shadcn/button";
import Icon from "@atoms/Icon";
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
  disabled?: boolean;
  /**
   * If defined, the query parameters with the given keys
   *  will be removed when the select value is cleared.
   */
  paramsToRemove?: string[];
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
  disabled = false,
  paramsToRemove = [],
}: SelectFilterProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [selectedValue, setSelectedValue] = useState(
    value || searchParams.get(paramKey) || undefined,
  );

  useEffect(() => {
    if (isInsideModal) {
      setSelectedValue(value || undefined);
      return;
    }
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
      paramsToRemove?.forEach((key) => params.delete(key));
    }

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-0">
      <Select
        onValueChange={handleFilterChange}
        value={selectedValue ?? ""}
        disabled={disabled || !options.length}
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
          <Icon name="X" />
        </Button>
      </ShouldRender>
    </div>
  );
};

export default SelectFilter;
