"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Switch } from "@shadcn/switch";
import { Label } from "@shadcn/label";
import { useState, useEffect } from "react";
import { cn } from "@/app/_lib/utils";

type SwitchFilterProps = {
  paramKey: string;
  value?: boolean;
  onChange?: (value: boolean) => void;
  className?: string;
  isInsideModal?: boolean;
};

const SwitchFilter = ({
  paramKey,
  value,
  onChange,
  className,
  isInsideModal = false,
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
    const params = new URLSearchParams(searchParams.toString());
    setChecked(value);

    if (onChange) return onChange(value);

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
        "flex items-center space-x-2 rounded-md border border-input bg-background px-3 py-2 md:rounded-full md:px-4",
        className,
      )}
    >
      <Switch
        id="ignore-loans"
        checked={checked}
        onCheckedChange={handleFilterChange}
      />
      <Label htmlFor="ignore-loans" className="whitespace-nowrap text-sm">
        Ignorar empréstimos
      </Label>
    </div>
  );
};

export default SwitchFilter;
