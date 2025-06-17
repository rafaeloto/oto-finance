"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Switch } from "@shadcn/switch";
import { Label } from "@shadcn/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@shadcn/tooltip";
import Icon from "@atoms/Icon";
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

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="HelpCircle" size={18} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[250px]">
            <p>
              Quando ativado, as transações de ganho e despesa com a categoria
              &quot;Empréstimo&quot; não serão considerados nas informações
              abaixo
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default SwitchFilter;
