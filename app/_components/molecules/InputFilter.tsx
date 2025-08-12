import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "@hooks/useRouter";
import { Input } from "@shadcn/input";
import { useEffect, useMemo, useState } from "react";
import ShouldRender from "@atoms/ShouldRender";
import { Button } from "@shadcn/button";
import Icon from "@atoms/Icon";
import debounce from "lodash.debounce";

type InputFilterProps = {
  paramKey: string;
  placeholder: string;
  value?: string;
  onChange?: (value: string | undefined) => void;
  isInsideModal?: boolean;
  hideClearButton?: boolean;
};

const InputFilter = ({
  paramKey,
  placeholder,
  value: externalValue,
  onChange,
  isInsideModal = false,
  hideClearButton = false,
}: InputFilterProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [localValue, setLocalValue] = useState(
    externalValue || searchParams.get(paramKey) || "",
  );

  useEffect(() => {
    if (isInsideModal) return;
    setLocalValue(externalValue || searchParams.get(paramKey) || "");
  }, [isInsideModal, externalValue, searchParams, paramKey]);

  const updateParams = useMemo(
    () =>
      debounce((value: string | undefined) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
          params.set(paramKey, value);
        } else {
          params.delete(paramKey);
        }

        replace(`${pathname}?${params.toString()}`);
      }, 300),
    [paramKey, pathname, replace, searchParams],
  );

  const handleFilterChange = (value: string | undefined) => {
    setLocalValue(value ?? "");

    if (onChange) return onChange(value);
    updateParams(value);
  };

  return (
    <div className="flex items-center gap-0">
      <Input
        placeholder={placeholder}
        onChange={(e) => handleFilterChange(e.target.value)}
        className="w-full md:w-[10rem] md:rounded-full"
        value={localValue}
      />

      <ShouldRender if={!!localValue && !hideClearButton}>
        <Button
          variant="ghost"
          size="icon"
          className="p-0 hover:scale-110 hover:bg-transparent"
          onClick={() => handleFilterChange("")}
        >
          <Icon name="X" />
        </Button>
      </ShouldRender>
    </div>
  );
};

export default InputFilter;
