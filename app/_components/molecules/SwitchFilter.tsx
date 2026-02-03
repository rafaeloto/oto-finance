"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "@hooks/useRouter";
import { Switch } from "@shadcn/switch";
import { Label } from "@shadcn/label";
import ShouldRender from "@atoms/ShouldRender";
import { useState, useEffect } from "react";
import { cn } from "@/app/_lib/utils";

type SwitchFilterProps = {
  paramKey: string;
  label: string;
  value?: boolean;
  onChange?: (value: boolean) => void;
  className?: string;
  isInsideModal?: boolean;
  tooltip?: React.ReactNode;
};

const SwitchFilter = ({
  paramKey,
  label,
  value,
  onChange,
  className,
  isInsideModal = false,
  tooltip,
}: SwitchFilterProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [checked, setChecked] = useState(
    value || searchParams.get(paramKey) === "true",
  );

  useEffect(() => {
    if (isInsideModal) {
      setChecked(!!value);
      return;
    }
    setChecked(!!(value || searchParams.get(paramKey) === "true"));
  }, [isInsideModal, value, searchParams, paramKey]);

  const handleFilterChange = (value: boolean) => {
    setChecked(value);

    if (onChange) return onChange(value);

    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(paramKey, "true");
    } else {
      params.delete(paramKey);
    }

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between space-x-2 rounded-md border border-input bg-background px-3 py-2 md:rounded-full md:px-4",
        className,
      )}
    >
      <div className="flex items-center space-x-4 md:space-x-2">
        <Switch
          id="ignore-loans"
          checked={checked}
          onCheckedChange={handleFilterChange}
        />

        <Label
          htmlFor="ignore-loans"
          className="cursor-pointer whitespace-nowrap text-sm"
          onClick={(e) => {
            // Prevent default form submission behavior when clicking the label
            if (isInsideModal) {
              e.preventDefault();
              const newValue = !checked;
              handleFilterChange(newValue);
            }
          }}
        >
          {label}
        </Label>
      </div>

      <ShouldRender if={!!tooltip}>{tooltip}</ShouldRender>
    </div>
  );
};

export default SwitchFilter;
