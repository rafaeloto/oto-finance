import ShouldRender from "@atoms/ShouldRender";
import { ImageAndLabelOption } from "@molecules/ImageAndLabelOption";
import TransactionInstallments from "@molecules/TransactionInstallments";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shadcn/form";
import { Input } from "@shadcn/input";
import { Label } from "@shadcn/label";
import { RadioGroup, RadioGroupItem } from "@shadcn/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shadcn/select";
import { useCreditCards } from "@contexts/CreditCardsContext";
import { getInvoiceOptions } from "@utils/date";
import { Transaction } from "@prisma/client";
import { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";

export type InstallmentType = "once" | "split" | undefined;

type CreditCardFieldsProps = {
  transaction?: Transaction;
};

const CreditCardFields = ({ transaction }: CreditCardFieldsProps) => {
  const isInstallment = !!transaction?.installmentId;

  const { control, watch, setValue, clearErrors } = useFormContext();
  const { creditCards, loading: loadingCreditCards } = useCreditCards();

  const selectedCardId = watch("cardId");
  const selectedDate = watch("date");
  const selectedInstallmentType = watch("installmentType");
  const invoiceMonth = watch("invoiceMonth");

  const selectedCard = useMemo(
    () => creditCards.find((card) => card.id === selectedCardId),
    [selectedCardId, creditCards],
  );

  const invoiceOptions = useMemo(() => {
    if (!selectedDate || !selectedCard) return [];

    return getInvoiceOptions(
      selectedDate,
      selectedCard.closingDate,
      selectedCard.dueDate,
    );
  }, [selectedCard, selectedDate]);

  const selectedYear = useMemo(
    () => invoiceOptions.find((option) => option.value === invoiceMonth)?.year,
    [invoiceMonth, invoiceOptions],
  );

  // Ensures the selected invoice is valid
  useEffect(() => {
    if (!invoiceOptions.some((option) => option.value === invoiceMonth)) {
      setValue("invoiceMonth", undefined);
      setValue("invoiceYear", undefined);
    }
  }, [invoiceOptions, invoiceMonth, setValue]);

  // Clears the invoiceMonth and invoiceYear when
  // the card or date are undefined, and selects the first
  // available invoice when those values change
  useEffect(() => {
    if (!selectedDate || !selectedCard) {
      setValue("invoiceMonth", undefined);
      setValue("invoiceYear", undefined);
      return;
    }

    const fisrtInvoice = invoiceOptions[0];
    setValue("invoiceMonth", fisrtInvoice?.value);
    setValue("invoiceYear", fisrtInvoice?.year);
    clearErrors(["invoiceMonth", "invoiceYear"]);
  }, [selectedDate, selectedCard, invoiceOptions, setValue, clearErrors]);

  return (
    <>
      <div className="flex w-full items-end space-x-6">
        <FormField
          control={control}
          name="cardId"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormLabel>Cartão de crédito</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={loadingCreditCards || isInstallment}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cartão..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {creditCards?.map((card) => (
                    <SelectItem key={card.id} value={card.id}>
                      <ImageAndLabelOption
                        src={`/credit-cards/${card.flag}.svg`}
                        label={card.name}
                      />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <ShouldRender if={!isInstallment}>
          <FormField
            control={control}
            name="installmentType"
            render={({ field }) => (
              <FormItem className="mb-3 w-min md:w-2/5">
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value || "once"}
                    className="flex flex-col gap-3 md:flex-row md:gap-5"
                  >
                    <FormItem className="flex items-center space-x-1 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="once" />
                      </FormControl>
                      <FormLabel>À vista</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-1 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="split" />
                      </FormControl>
                      <FormLabel>Parcelado</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </ShouldRender>

        <ShouldRender if={isInstallment}>
          <div className="flex flex-col items-center gap-2">
            <Label>Parcela</Label>
            <TransactionInstallments transaction={transaction!} />
          </div>
        </ShouldRender>
      </div>

      <div className="flex w-full space-x-4">
        <FormField
          control={control}
          name="invoiceMonth"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormLabel>Fatura</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value ? field.value.toString() : undefined}
                disabled={!selectedCardId || !selectedDate}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a fatura..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {invoiceOptions?.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value.toString()}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="invoiceYear"
          render={({ field }) => (
            <FormItem className="mt-auto w-1/4">
              <FormLabel>Ano</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled
                  value={selectedYear}
                  placeholder="Ano"
                  style={{ opacity: 1 }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ShouldRender if={selectedInstallmentType === "split"}>
          <FormField
            control={control}
            name="installments"
            render={({ field }) => (
              <FormItem className="w-1/4">
                <FormLabel>Parcelas</FormLabel>
                <FormControl>
                  <Input
                    min={2}
                    max={12}
                    type="number"
                    {...field}
                    disabled={!selectedCardId || !selectedDate}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </ShouldRender>
      </div>
    </>
  );
};

export default CreditCardFields;
