"use client";

import ShouldRender from "@atoms/ShouldRender";
import { Button } from "@shadcn/button";
import { EyeIcon } from "lucide-react";
import { useState } from "react";
import PayInvoiceDialog from "./PayInvoiceDialog";
import { Invoice } from "@prisma/client";
import { cn } from "@/app/_lib/utils";

interface InvoiceButtonsProps {
  onClickSee: () => void;
  canBePaid: boolean;
  invoice: Invoice;
  noPadding?: boolean;
}

const InvoiceButtons = ({
  onClickSee,
  canBePaid,
  invoice,
  noPadding = false,
}: InvoiceButtonsProps) => {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  return (
    <>
      <div className="flex items-center space-x-3 md:space-x-1">
        <Button
          variant="ghost"
          size={noPadding ? "sm" : "icon"}
          className={cn("text-muted-foreground", noPadding && "p-0")}
          onClick={() => onClickSee()}
        >
          <EyeIcon />
        </Button>

        <ShouldRender if={canBePaid}>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
            onClick={() => setIsPaymentDialogOpen(true)}
          >
            Pagar
          </Button>
        </ShouldRender>
      </div>

      <PayInvoiceDialog
        isOpen={isPaymentDialogOpen}
        setIsOpen={setIsPaymentDialogOpen}
        invoice={invoice}
      />
    </>
  );
};

export default InvoiceButtons;
