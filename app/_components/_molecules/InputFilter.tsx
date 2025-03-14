import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";

type InputFilterProps = {
  paramKey: string;
  placeholder: string;
};

const InputFilter = ({ paramKey, placeholder }: InputFilterProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleFilterChange = (value: string | undefined) => {
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
      className="w-[10rem] rounded-full"
    />
  );
};

export default InputFilter;
