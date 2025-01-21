"use client";

import ShouldRender from "@/app/_components/should-render";
import { Button } from "@/app/_components/ui/button";
import { EyeIcon } from "lucide-react";
import { useState } from "react";
import PayInvoiceDialog from "./pay-invoice-dialog";
import { Invoice } from "@prisma/client";

interface InvoiceButtonsProps {
  onClickSee: () => void;
  canBePaid: boolean;
  invoice: Invoice;
}

const InvoiceButtons = ({
  onClickSee,
  canBePaid,
  invoice,
}: InvoiceButtonsProps) => {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  return (
    <>
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground"
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
