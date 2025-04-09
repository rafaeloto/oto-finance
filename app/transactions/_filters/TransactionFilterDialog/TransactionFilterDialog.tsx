import InputFilter from "@molecules/InputFilter";
import SelectFilter from "@molecules/SelectFilter";
import TimeSelect from "@molecules/TimeSelect";
import { Button } from "@shadcn/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shadcn/dialog";
import {
  TRANSACTION_PAYMENT_METHOD_OPTIONS,
  TRANSACTION_TYPE_OPTIONS,
} from "@constants/transaction";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import TransactionTypeBadge from "../../_components/type-badge";
import { TransactionType } from "@prisma/client";
import { useAccounts } from "@contexts/AccountsContext";
import { useCreditCards } from "@contexts/CreditCardsContext";
import { ImageAndLabelOption } from "@molecules/ImageAndLabelOption";

export type TransactionFilters = {
  name: string;
  type: string;
  paymentMethod: string;
  accountId: string;
  cardId: string;
  month: string;
  year: string;
};

type TransactionFilterDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const TransactionFilterDialog = (params: TransactionFilterDialogProps) => {
  const { open, setOpen } = params;

  const { accounts } = useAccounts();
  const { creditCards } = useCreditCards();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState<TransactionFilters>({
    name: "",
    type: "",
    paymentMethod: "",
    accountId: "",
    cardId: "",
    month: "",
    year: "",
  });

  // Fills the filters with the URL values when opening the modal
  useEffect(() => {
    if (open) {
      setFilters({
        name: searchParams.get("name") || "",
        type: searchParams.get("type") || "",
        paymentMethod: searchParams.get("paymentMethod") || "",
        accountId: searchParams.get("accountId") || "",
        cardId: searchParams.get("cardId") || "",
        month: searchParams.get("month") || "",
        year: searchParams.get("year") || "",
      });
    }
  }, [open, searchParams]);

  const applyFilters = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`?${params.toString()}`);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[95svw] max-w-lg">
        <DialogHeader>
          <DialogTitle>Filtros</DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          <InputFilter
            value={filters.name}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, name: value ?? "" }))
            }
            paramKey="name"
            placeholder="Nome"
          />

          <SelectFilter
            paramKey="type"
            value={filters.type}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, type: value ?? "" }))
            }
            options={TRANSACTION_TYPE_OPTIONS.map((option) => ({
              value: option.value,
              label: (
                <TransactionTypeBadge type={option.value as TransactionType} />
              ),
            }))}
            placeholder="Tipo"
          />

          <SelectFilter
            paramKey="paymentMethod"
            value={filters.paymentMethod}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, paymentMethod: value ?? "" }))
            }
            options={TRANSACTION_PAYMENT_METHOD_OPTIONS.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
            placeholder="Método"
          />

          <SelectFilter
            paramKey="accountId"
            value={filters.accountId}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, accountId: value ?? "" }))
            }
            options={accounts.map((account) => ({
              value: account.id,
              label: (
                <ImageAndLabelOption
                  src={`/banks/${account.bank}.svg`}
                  label={account.name}
                />
              ),
            }))}
            placeholder="Conta"
          />

          <SelectFilter
            paramKey="cardId"
            value={filters.cardId}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, cardId: value ?? "" }))
            }
            options={creditCards.map((card) => ({
              value: card.id,
              label: (
                <ImageAndLabelOption
                  src={`/credit-cards/${card.flag}.svg`}
                  label={card.name}
                />
              ),
            }))}
            placeholder="Cartão"
          />

          <TimeSelect
            filters={{ month: filters.month, year: filters.year }}
            setFilters={setFilters}
          />
        </div>

        <DialogFooter className="flex gap-3 md:gap-0">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>

          <Button onClick={applyFilters}>Aplicar filtros</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionFilterDialog;
