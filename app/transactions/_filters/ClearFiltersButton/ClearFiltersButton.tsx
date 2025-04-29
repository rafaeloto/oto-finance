import { usePathname, useRouter } from "next/navigation";
import { Button } from "@shadcn/button";
import ShouldRender from "@/app/_components/atoms/ShouldRender";
import { useCallback } from "react";

type ClearFiltersButtonParams = {
  shouldRender: boolean;
  onClick?: () => void;
};

const ClearFiltersButton = ({
  shouldRender,
  onClick,
}: ClearFiltersButtonParams) => {
  const pathname = usePathname();
  const { replace } = useRouter();

  const clearFilters = useCallback(() => {
    replace(pathname);
    onClick?.();
  }, [onClick, pathname, replace]);

  return (
    <ShouldRender if={shouldRender}>
      <Button
        variant="destructive"
        className="w-full md:w-fit md:rounded-full"
        onClick={clearFilters}
      >
        Limpar filtros
      </Button>
    </ShouldRender>
  );
};

export default ClearFiltersButton;
