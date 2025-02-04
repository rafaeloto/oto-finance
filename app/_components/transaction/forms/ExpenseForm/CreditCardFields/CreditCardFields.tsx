import { Card } from "@/app/_components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { useCreditCards } from "@/app/_contexts/CreditCardsContext";
import { getImportantDates } from "@/app/_utils/date";
import Image from "next/image";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";

type Props = {
  selectedYear: number;
  setSelectedYear: React.Dispatch<React.SetStateAction<number>>;
};

const CreditCardFields = ({ selectedYear, setSelectedYear }: Props) => {
  const { control, watch } = useFormContext();

  const { creditCards, loading: loadingCreditCards } = useCreditCards();

  const { month: currentMonth, nextMonth } = getImportantDates(new Date());

  const selectedCardId = watch("cardId");
  const selectedDate = watch("date");

  // Function to generate the invoice options based on the selected date
  const invoiceOptions = useMemo(() => {
    if (!selectedDate) return [currentMonth, nextMonth];

    const { month: selectedDateMonth, nextMonth: selectedDatenextMonth } =
      getImportantDates(selectedDate);

    return [selectedDateMonth, selectedDatenextMonth];
  }, [currentMonth, nextMonth, selectedDate]);

  const handleMonthChange = (value: string) => {
    const selectedMonth = Number(value);
    const { year: selectedDateYear, nextYear: selectedDateNextYear } =
      getImportantDates(selectedDate);

    setSelectedYear(() => {
      if (invoiceOptions.includes(12) && invoiceOptions.includes(1)) {
        return selectedMonth === 12 ? selectedDateYear : selectedDateNextYear;
      }
      return selectedDateYear;
    });
  };

  return (
    <>
      <FormField
        control={control}
        name="cardId"
        render={({ field }) => (
          <FormItem>
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
                    <div className="flex items-center space-x-5">
                      <Image
                        src={`/credit-cards/${card.flag}.svg`}
                        alt={card.flag || "Cartão"}
                        width={20}
                        height={20}
                      />
                      <span>{card.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

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
                  {invoiceOptions?.map((value) => (
                    <SelectItem key={value} value={value.toString()}>
                      {value}
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
      </div>
    </>
  );
};

export default CreditCardFields;
