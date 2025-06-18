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
import TransactionTypeBadge from "../../_components/TransactionTypeBadge";
import { TransactionType } from "@prisma/client";
import { useAccounts } from "@contexts/AccountsContext";
import { useCreditCards } from "@contexts/CreditCardsContext";
import { ImageAndLabelOption } from "@molecules/ImageAndLabelOption";
import ClearFiltersButton from "../ClearFiltersButton";
import Icon, { type LucideIconName } from "@/app/_components/atoms/Icon";
import { useAllCategories } from "@contexts/CategoriesContext";

export type TransactionFilters = {
  name: string;
  type: string;
  categoryId: string;
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
  const { categories } = useAllCategories();

  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState<TransactionFilters>({
    name: "",
    type: "",
    categoryId: "",
    paymentMethod: "",
    accountId: "",
    cardId: "",
    month: "",
    year: "",
  });

  /**
   * Checks if any filter, except 'month' and 'year', is active
   */
  const hasActiveFilters = Array.from(searchParams.entries()).some(
    ([key, value]) => value && key !== "month" && key !== "year",
  );

  // Fills the filters with the URL values when opening the modal
  useEffect(() => {
    if (open) {
      setFilters({
        name: searchParams.get("name") || "",
        type: searchParams.get("type") || "",
        categoryId: searchParams.get("categoryId") || "",
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
            isInsideModal
          />

          <SelectFilter
            paramKey="type"
            value={filters.type}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                type: value ?? "",
                categoryId: "",
              }))
            }
            options={TRANSACTION_TYPE_OPTIONS.map((option) => ({
              value: option.value,
              label: (
                <TransactionTypeBadge type={option.value as TransactionType} />
              ),
            }))}
            placeholder="Tipo"
            isInsideModal
          />

          <SelectFilter
            paramKey="categoryId"
            value={filters.categoryId}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, categoryId: value ?? "" }))
            }
            options={categories
              .filter(
                (cat) => cat?.parentId === null && cat?.type === filters.type,
              )
              .map((category) => ({
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
            isInsideModal
            disabled={!filters.type}
          />

          <SelectFilter
            paramKey="paymentMethod"
            value={filters.paymentMethod}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                paymentMethod: value ?? "",
                accountId: "",
                cardId: "",
              }))
            }
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
            isInsideModal
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
            isInsideModal
            disabled={filters.paymentMethod !== "DEBIT"}
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
            isInsideModal
            disabled={filters.paymentMethod !== "CREDIT"}
          />

          <TimeSelect<TransactionFilters>
            filters={filters}
            setFilters={setFilters}
            isInsideModal
          />

          <ClearFiltersButton
            shouldRender={hasActiveFilters}
            onClick={() => {
              setOpen(false);
            }}
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
