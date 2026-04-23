import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useInvoices } from "@contexts/InvoicesContext";
import { Transaction } from "@prisma/client";
import { z } from "zod";
import { upsertCreditReturnTransaction } from "@actions/transactions/upsertCreditReturnTransaction";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shadcn/form";
import { Input } from "@shadcn/input";
import { MoneyInput } from "@atoms/MoneyInput";
import { useCategories } from "@contexts/CategoriesContext";
import { DatePicker } from "@shadcn/date-picker";
import { DialogClose, DialogFooter } from "@shadcn/dialog";
import { Button } from "@shadcn/button";
import { useMemo, useState } from "react";
import { getImportantDates, getLocalDate } from "@utils/date";
import CreditCardFields from "../ExpenseForm/CreditCardFields";
import Icon from "@atoms/Icon";
import CategoryField, {
  type openCategoryDialogProps,
} from "@components/category/CategoryField";

const creditReturnFormSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  amount: z.number().positive("O valor deve ser positivo"),
  categoryId: z.string().min(1, "A categoria é obrigatória"),
  cardId: z.string().min(1, "O cartão de crédito é obrigatório"),
  invoiceMonth: z.number().min(1, "Selecione uma fatura"),
  invoiceYear: z.number().min(1, "O ano da fatura é obrigatório"),
  date: z.date({ required_error: "A data é obrigatória" }),
});

export type CreditReturnFormSchema = z.infer<typeof creditReturnFormSchema>;

interface CreditReturnFormProps {
  setIsOpen: (open: boolean) => void;
  transaction?: Transaction;
  openCategoryDialog: (props: openCategoryDialogProps) => void;
}

const CreditReturnForm = ({
  setIsOpen,
  transaction,
  openCategoryDialog,
}: CreditReturnFormProps) => {
  const transactionId = transaction?.id;
  const isUpdate = !!transactionId;

  const {
    invoices,
    loading: loadingInvoices,
    error: invoicesError,
    reload: reloadInvoices,
  } = useInvoices();

  const {
    categories,
    loading: loadingCategories,
    error: categoriesError,
  } = useCategories("GAIN");

  const loading = loadingInvoices || loadingCategories;
  const error = invoicesError || categoriesError;

  const { month: currentMonth, year: currentYear } = getImportantDates();

  const defaultInvoice = useMemo(() => {
    const invoice = invoices.find(
      (invoice) => invoice.id === transaction?.invoiceId,
    );
    if (!invoice) return;

    return {
      month: invoice.month,
      year: invoice.year,
    };
  }, [invoices, transaction]);

  const [upserting, setUpserting] = useState(false);

  const defaultValues = {
    name: transaction?.name || "",
    amount: Number(transaction?.amount) || 0,
    categoryId: transaction?.categoryId || categories[0]?.id,
    cardId: transaction?.cardId || "",
    invoiceMonth: defaultInvoice?.month || currentMonth,
    invoiceYear: defaultInvoice?.year || currentYear,
    date: getLocalDate({ date: transaction?.date, noon: true }),
  };

  const form = useForm({
    resolver: zodResolver(creditReturnFormSchema),
    defaultValues,
  });

  console.log({ errors: form.formState.errors });
  console.log({ values: form.getValues() });

  const onSubmit = async (data: CreditReturnFormSchema) => {
    console.log({ data });
    const onSuccess = () => {
      setUpserting(false);
      toast.success(
        `Reembolso ${isUpdate ? "atualizado" : "criado"} com sucesso!`,
      );
      setIsOpen(false);
      form.reset();
    };

    const onError = (error: Error) => {
      setUpserting(false);
      toast.error(`Erro ao ${isUpdate ? "atualizar" : "criar"} reembolso!`);
      console.error(error);
    };

    setUpserting(true);

    try {
      await upsertCreditReturnTransaction({
        ...data,
        transactionId,
      });
      await reloadInvoices();
      onSuccess();
    } catch (error) {
      onError(error as Error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full flex-col"
      >
        <div className="mb-8 flex-1 space-y-8 px-1">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da devolução</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor da devolução</FormLabel>
                <FormControl>
                  <MoneyInput
                    placeholder="Digite o valor..."
                    value={field.value}
                    onValueChange={({ floatValue }) =>
                      field.onChange(floatValue)
                    }
                    onBlur={field.onBlur}
                    disabled={field.disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <CategoryField
            categories={categories}
            type="GAIN"
            openCategoryDialog={openCategoryDialog}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data da devolução</FormLabel>
                <DatePicker value={field.value} onChange={field.onChange} />
                <FormMessage />
              </FormItem>
            )}
          />

          <CreditCardFields transaction={transaction} hideInstallments={true} />
        </div>

        <DialogFooter className="flex gap-3 md:gap-0">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={loading || upserting || !!error}
            className="min-w-24"
          >
            {upserting ? (
              <Icon name="Loader2" className="animate-spin" />
            ) : isUpdate ? (
              "Atualizar"
            ) : (
              "Adicionar"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default CreditReturnForm;
