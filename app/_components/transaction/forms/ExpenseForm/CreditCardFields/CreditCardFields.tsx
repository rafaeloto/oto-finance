import ShouldRender from "@/app/_components/_atoms/should-render";
import { ImageAndLabelOption } from "@/app/_components/_molecules/SelectOptions";
import { Card } from "@/app/_components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/app/_components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { useCreditCards } from "@/app/_contexts/CreditCardsContext";
import { getInvoiceOptions } from "@/app/_utils/date";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";

export type InstallmentType = "once" | "split" | undefined;

type Props = {
  selectedYear: number;
  setSelectedYear: React.Dispatch<React.SetStateAction<number>>;
};

const CreditCardFields = ({ selectedYear, setSelectedYear }: Props) => {
  const { control, watch } = useFormContext();

  const { creditCards, loading: loadingCreditCards } = useCreditCards();

  const selectedCardId = watch("cardId");
  const selectedDate = watch("date");
  const selectedInstallmentType = watch("installmentType");

  const selectedCard = useMemo(() => {
    if (!selectedCardId) return;

    return creditCards.find((card) => card.id === selectedCardId);
  }, [selectedCardId, creditCards]);

  const invoiceOptions = useMemo(() => {
    if (!selectedDate || !selectedCard) return [];

    return getInvoiceOptions(
      selectedDate,
      selectedCard.closingDate,
      selectedCard.dueDate,
    );
  }, [selectedCard, selectedDate]);

  const handleMonthChange = (value: string) => {
    const selectedMonth = Number(value);

    const year = invoiceOptions.find(
      (option) => option.value === selectedMonth,
    )?.year;
    if (!!year) setSelectedYear(year);
  };

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
                defaultValue={field.value}
                disabled={loadingCreditCards}
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

        <FormField
          control={control}
          name="installmentType"
          render={({ field }) => (
            <FormItem className="mb-3 w-min md:w-2/5">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-2 md:flex-row md:space-x-3"
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
      </div>

      <div className="flex w-full space-x-4">
        <FormField
          control={control}
          name="invoiceMonth"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormLabel>Fatura</FormLabel>
              <Select
                onValueChange={(value) => {
                  handleMonthChange(value);
                  field.onChange(Number(value));
                }}
                defaultValue={field.value.toString()}
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

        <Card className="mt-auto flex h-10 w-1/4 items-center justify-center">
          {selectedYear}
        </Card>

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
