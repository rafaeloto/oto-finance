"use client";

import {
  TRANSACTION_PAYMENT_METHOD_OPTIONS,
  TRANSACTION_TYPE_OPTIONS,
} from "@constants/transaction";
import TransactionTypeBadge from "../_components/TransactionTypeBadge";
import { TransactionType } from "@prisma/client";
import SelectFilter from "@molecules/SelectFilter";
import { useAccounts } from "@contexts/AccountsContext";
import { useCreditCards } from "@contexts/CreditCardsContext";
import { ImageAndLabelOption } from "@molecules/ImageAndLabelOption";
import InputFilter from "@molecules/InputFilter";
import TimeSelect from "@molecules/TimeSelect";
import { Button } from "@shadcn/button";
import Icon, { type LucideIconName } from "@atoms/Icon";
import TransactionFilterDialog from "./TransactionFilterDialog";
import ClearFiltersButton from "./ClearFiltersButton";
import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/app/_lib/utils";
import { useAllCategories } from "@contexts/CategoriesContext";

const TransactionFilters = () => {
  const {
    accounts,
    loading: loadingAccounts,
    error: accountsError,
  } = useAccounts();

  const {
    creditCards,
    loading: loadingCreditCards,
    error: creditCardsError,
  } = useCreditCards();

  const {
    categories,
    loading: loadingCategories,
    error: categoriesError,
  } = useAllCategories();

  const [open, setOpen] = useState(false);

  const searchParams = useSearchParams();
  const selectedType = searchParams.get("type");

  const filteredCategories = useMemo(() => {
    return categories.filter(
      (cat) => cat?.parentId === null && cat?.type === selectedType,
    );
  }, [categories, selectedType]);

  /**
   * Checks if any filter, except 'month' and 'year', is active
   */
  const hasActiveFilters = Array.from(searchParams.entries()).some(
    ([key, value]) => value && key !== "month" && key !== "year",
  );

  return (
    <>
      {/* Desktop */}
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
          paramsToRemove={["categoryId"]}
        />

        <SelectFilter
          paramKey="categoryId"
          options={filteredCategories.map((category) => ({
            value: category.id,
            label: (
              <div className="flex items-center gap-3">
                <Icon
                  name={category?.icon as LucideIconName}
                  {...(!!category?.color && { color: category.color })}
                />
                <p>{category?.name || "Não especificado"}</p>
              </div>
            ),
          }))}
          placeholder="Categoria"
          disabled={
            !searchParams.get("type") || loadingCategories || !!categoriesError
          }
        />

        <SelectFilter
          paramKey="paymentMethod"
          options={TRANSACTION_PAYMENT_METHOD_OPTIONS.map((option) => ({
            value: option.value,
            label: (
              <div className="flex items-center gap-3">
                <Icon name={option.icon as LucideIconName} />
                <p>{option.label}</p>
              </div>
            ),
          }))}
          placeholder="Método"
          paramsToRemove={["accountId", "cardId"]}
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
          disabled={
            searchParams.get("paymentMethod") !== "DEBIT" ||
            loadingAccounts ||
            !!accountsError
          }
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
          disabled={
            searchParams.get("paymentMethod") !== "CREDIT" ||
            loadingCreditCards ||
            !!creditCardsError
          }
        />

        <TimeSelect />

        <ClearFiltersButton shouldRender={hasActiveFilters} />
      </div>

      {/* Mobile */}
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
          <Icon name="Filter" />
        </Button>

        <TransactionFilterDialog open={open} setOpen={setOpen} />
      </div>
    </>
  );
};

export default TransactionFilters;
