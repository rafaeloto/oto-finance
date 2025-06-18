import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formSchemas } from "../formSchema";
import { useAccounts } from "@contexts/AccountsContext";
import { useInvoices } from "@contexts/InvoicesContext";
import { Transaction, TransactionPaymentMethod } from "@prisma/client";
import { z } from "zod";
import { upsertExpenseTransaction } from "@actions/transactions/upsertExpenseTransaction";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shadcn/select";
import { TRANSACTION_PAYMENT_METHOD_OPTIONS } from "@constants/transaction";
import { useCategories } from "@contexts/CategoriesContext";
import { DatePicker } from "@shadcn/date-picker";
import { DialogClose, DialogFooter } from "@shadcn/dialog";
import { Button } from "@shadcn/button";
import ShouldRender from "@atoms/ShouldRender";
import { useMemo, useState } from "react";
import handleCreditTransaction from "./handleCreditTransaction";
import { getImportantDates } from "@utils/date";
import CreditCardFields from "./CreditCardFields";
import type { InstallmentType } from "./CreditCardFields";
import Icon, { type LucideIconName } from "@atoms/Icon";
import { ImageAndLabelOption } from "@molecules/ImageAndLabelOption";
import CategoryField, {
  type openCategoryDialogProps,
} from "@components/category/CategoryField";

export type FormSchema = z.infer<typeof formSchemas.expense>;

interface ExpenseFormProps {
  setIsOpen: (open: boolean) => void;
  transaction?: Transaction;
  openCategoryDialog: (props: openCategoryDialogProps) => void;
}

const ExpenseForm = ({
  setIsOpen,
  transaction,
  openCategoryDialog,
}: ExpenseFormProps) => {
  const transactionId = transaction?.id;
  const isUpdate = !!transactionId;
  const isInstallment = !!transaction?.installmentId;

  const {
    accounts,
    loading: loadingAccounts,
    error: accountsError,
  } = useAccounts();

  const {
    invoices,
    loading: loadingInvoices,
    error: invoicesError,
    reloadInvoices,
  } = useInvoices();

  const {
    categories,
    loading: loadingCategories,
    error: categoriesError,
  } = useCategories("EXPENSE");

  const loading = loadingAccounts || loadingInvoices || loadingCategories;
  const error = accountsError || invoicesError || categoriesError;

  const { month: currentMonth, year: currentYear } = getImportantDates(
    new Date(),
  );

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
    paymentMethod:
      transaction?.paymentMethod || TransactionPaymentMethod.CREDIT,
    accountId: transaction?.accountId || "",
    cardId: transaction?.cardId || "",
    installmentType: "once" as InstallmentType,
    invoiceMonth: defaultInvoice?.month || currentMonth,
    invoiceYear: defaultInvoice?.year || currentYear,
    installments: 2,
    date: transaction?.date ? new Date(transaction?.date) : new Date(),
  };

  const form = useForm({
    resolver: zodResolver(formSchemas.expense),
    defaultValues,
  });

  const paymentMethod = form.watch("paymentMethod");
  const isCreditCard = paymentMethod === TransactionPaymentMethod.CREDIT;

  const onSubmit = async (data: FormSchema) => {
    const onSuccess = () => {
      setUpserting(false);
      toast.success(
        `Despesa ${isUpdate ? "atualizada" : "criada"} com sucesso!`,
      );
      setIsOpen(false);
      form.reset();
    };

    const onError = (error: Error) => {
      setUpserting(false);
      toast.error(`Erro ao ${isUpdate ? "atualizar" : "criar"} despesa!`);
      console.error(error);
    };

    setUpserting(true);

    // If it's a credit transaction, upserts credit transaction
    if (isCreditCard) {
      try {
        await handleCreditTransaction({
          data,
          transactionId,
        });

        await reloadInvoices();
        onSuccess();
      } catch (error) {
        onError(error as Error);
      }
      return;
    }

    // If it's not a credit transaction, upserts debit transaction
    try {
      delete data.cardId;
      delete data.installmentType;
      delete data.installments;
      delete data.invoiceMonth;
      delete data.invoiceYear;

      await upsertExpenseTransaction({
        ...data,
        id: transactionId,
      });
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
                <FormLabel>Nome</FormLabel>
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
                <FormLabel>Valor</FormLabel>
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
            type="EXPENSE"
            openCategoryDialog={openCategoryDialog}
          />

          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Método de pagamento</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isInstallment}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o metodo de pagamento..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TRANSACTION_PAYMENT_METHOD_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-3">
                          <Icon name={option.icon as LucideIconName} />
                          <p>{option.label}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data</FormLabel>
                <DatePicker value={field.value} onChange={field.onChange} />
                <FormMessage />
              </FormItem>
            )}
          />

          <ShouldRender if={!isCreditCard}>
            <FormField
              control={form.control}
              name="accountId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conta</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={loadingAccounts}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o conta..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accounts?.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          <ImageAndLabelOption
                            src={`/banks/${option.bank}.svg`}
                            label={option.name}
                          />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </ShouldRender>

          <ShouldRender if={isCreditCard}>
            <CreditCardFields transaction={transaction} />
          </ShouldRender>
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

export default ExpenseForm;
