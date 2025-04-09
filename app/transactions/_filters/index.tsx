"use client";

import {
  TRANSACTION_PAYMENT_METHOD_OPTIONS,
  TRANSACTION_TYPE_OPTIONS,
} from "@constants/transaction";
import TransactionTypeBadge from "../_components/type-badge";
import { TransactionType } from "@prisma/client";
import SelectFilter from "@molecules/SelectFilter";
import { useAccounts } from "@/app/_contexts/AccountsContext";
import { useCreditCards } from "@/app/_contexts/CreditCardsContext";
import { ImageAndLabelOption } from "@molecules/ImageAndLabelOption";
import InputFilter from "@molecules/InputFilter";
import TimeSelect from "@molecules/TimeSelect";
import { Button } from "@shadcn/button";
import { FilterIcon } from "lucide-react";
import TransactionFilterDialog from "./TransactionFilterDialog";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/app/_lib/utils";

const TransactionFilters = () => {
  const { accounts } = useAccounts();
  const { creditCards } = useCreditCards();

  const [open, setOpen] = useState(false);

  const searchParams = useSearchParams();
  // Checks if any filter, except 'month' and 'year', is active
  const hasActiveFilters = Array.from(searchParams.entries()).some(
    ([key, value]) => value && key !== "month" && key !== "year",
  );

  return (
    <>
      {/* DESKTOP */}
      <div className="hidden space-x-4 md:flex">
        <InputFilter paramKey="name" placeholder="Nome" />

        <SelectFilter
          paramKey="type"
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
          options={TRANSACTION_PAYMENT_METHOD_OPTIONS.map((option) => ({
            value: option.value,
            label: option.label,
          }))}
          placeholder="Método"
        />

        <SelectFilter
          paramKey="accountId"
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

        <TimeSelect />
      </div>

      {/* MOBILE */}
      <div className="block md:hidden">
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "rounded-full",
            hasActiveFilters && "animate-pulse border-primary",
          )}
          onClick={() => setOpen(true)}
        >
          <FilterIcon />
        </Button>

        <TransactionFilterDialog open={open} setOpen={setOpen} />
      </div>
    </>
  );
};

export default TransactionFilters;
