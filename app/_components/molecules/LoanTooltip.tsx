"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@shadcn/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@shadcn/popover";
import Icon from "@atoms/Icon";

const LoanTooltip = () => {
  return (
    <>
      {/* Desktop Tooltip */}
      <div className="hidden items-center md:flex">
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
            <TooltipContent side="top" className="max-w-[350px] space-y-4 p-6">
              <p className="text-xl font-bold">Ignorar empréstimos</p>
              <p className="text-lg">
                Quando ativado, as transações de{" "}
                <span className="text-primary">Ganho</span> e{" "}
                <span className="text-danger">Despesa</span> com a categoria{" "}
                <span className="font-bold">Empréstimo</span> não serão
                considerados nas informações do dashboard.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Mobile Popover */}
      <div className="flex items-center md:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="HelpCircle" size={18} />
            </button>
          </PopoverTrigger>
          <PopoverContent
            side="left"
            className="max-w-[60vw] space-y-4 p-4"
            sideOffset={8}
          >
            <p className="text-lg font-bold">Ignorar empréstimos</p>
            <p className="text-base">
              Quando ativado, as transações de{" "}
              <span className="text-primary">Ganho</span> e{" "}
              <span className="text-danger">Despesa</span> com a categoria{" "}
              <span className="font-bold">Empréstimo</span> não serão
              considerados nas informações do dashboard.
            </p>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};

export default LoanTooltip;
