"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@shadcn/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@shadcn/popover";
import Icon from "@atoms/Icon";
import { useMemo } from "react";
import useIsDesktop from "@utils/useIsDesktop";

type LoanTooltipProps = {
  position?: "top" | "right" | "bottom" | "left";
  context: "category" | "dashboard";
};

const LoanTooltip = ({ position, context }: LoanTooltipProps) => {
  const isDesktop = useIsDesktop();

  const side = useMemo(() => {
    if (position) return position;
    if (isDesktop) return "top";
    return "left";
  }, [position, isDesktop]);

  const icon = useMemo(
    () => (
      <span
        onClick={(e) => e.stopPropagation()}
        className="animate-pulse cursor-pointer text-muted-foreground hover:animate-none hover:text-foreground"
      >
        <Icon name="HelpCircle" size={18} />
      </span>
    ),
    [],
  );

  const content = useMemo(() => {
    if (context === "dashboard") {
      return (
        <>
          <p className="text-lg font-bold md:text-xl">Ignorar empréstimos</p>
          <p className="text-base md:text-lg">
            Quando ativado, as transações de{" "}
            <span className="text-primary">Ganho</span> e{" "}
            <span className="text-danger">Despesa</span> com a categoria{" "}
            <span className="font-bold">Empréstimo</span> não serão consideradas
            nas informações do dashboard.
          </p>
        </>
      );
    }

    return (
      <>
        <p className="text-lg font-bold md:text-xl">Empréstimo</p>
        <p className="text-base md:text-lg">
          Esta é uma categoria <span className="font-bold">especial</span>. Ela
          deve ser usada para quando você{" "}
          <span className="text-danger">paga</span> algo para alguém, e vai
          receber de volta, ou quando{" "}
          <span className="text-primary">recebe</span> aquele dinheirinho que
          outra pessoa estava te devendo.
          <br />
          <br />
          Com isso, voce pode ocultar as transações de empréstimos no dashboard,
          tendo uma visão mais clara das suas finanças.
        </p>
      </>
    );
  }, [context]);

  return (
    <>
      {/* Desktop Tooltip */}
      <div className="hidden items-center md:flex">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{icon}</TooltipTrigger>
            <TooltipContent
              side={side}
              className="max-w-[350px] space-y-4 p-6 shadow shadow-foreground"
            >
              {content}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Mobile Popover */}
      <div className="flex items-center md:hidden">
        <Popover>
          <PopoverTrigger asChild>{icon}</PopoverTrigger>
          <PopoverContent
            side={side}
            className="max-w-[60vw] space-y-4 p-4 shadow-sm shadow-foreground"
            sideOffset={8}
          >
            {content}
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};

export default LoanTooltip;
