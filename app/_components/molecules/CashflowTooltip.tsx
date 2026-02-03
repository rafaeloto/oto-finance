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
import useIsDesktop from "@hooks/useIsDesktop";

type CashflowTooltipProps = {
  position?: "top" | "right" | "bottom" | "left";
};

const CashflowTooltip = ({ position }: CashflowTooltipProps) => {
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
    return (
      <>
        <p className="text-lg font-bold md:text-xl">Visão caixa</p>
        <p className="text-base md:text-lg">
          Quando ativado, as transações no{" "}
          <span className="font-bold">crédito</span> serão consideradas no mês
          em que a sua fatura é paga. Transações no{" "}
          <span className="font-bold">débito</span> serão consideradas no mês em
          que foram executadas.
        </p>
      </>
    );
  }, []);

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

export default CashflowTooltip;
