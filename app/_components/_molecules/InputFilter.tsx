import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";

type InputFilterProps = {
  paramKey: string;
  placeholder: string;
  value?: string;
  onChange?: (value: string | undefined) => void;
};

const InputFilter = ({
  paramKey,
  placeholder,
  value,
  onChange,
}: InputFilterProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleFilterChange = (value: string | undefined) => {
    if (onChange) return onChange(value);

    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(paramKey, value);
    } else {
      params.delete(paramKey);
    }

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Input
      placeholder={placeholder}
      onChange={(e) => handleFilterChange(e.target.value)}
      className="w-full md:w-[10rem] md:rounded-full"
      value={value ?? ""}
    />
  );
};

export default InputFilter;
