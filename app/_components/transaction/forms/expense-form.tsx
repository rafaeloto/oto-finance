import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formSchemas } from "./formSchema";
import { useAccounts } from "@/app/_contexts/AccountsContext";
import { useCreditCards } from "@/app/_contexts/CreditCardsContext";
import { useInvoices } from "@/app/_contexts/InvoicesContext";
import {
  ExpenseTransactionCategory,
  Transaction,
  TransactionPaymentMethod,
} from "@prisma/client";
import { z } from "zod";
import { upsertExpenseTransaction } from "@/app/_actions/transactions/upsert-expense-transaction";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { MoneyInput } from "../../money-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  EXPENSE_TRANSACTION_CATEGORY_OPTIONS,
  TRANSACTION_PAYMENT_METHOD_OPTIONS,
} from "@/app/_constants/transaction";
import { DatePicker } from "../../ui/date-picker";
import { DialogClose, DialogFooter } from "../../ui/dialog";
import { Button } from "../../ui/button";
import ShouldRender from "../../should-render";
import Image from "next/image";

type FormSchema = z.infer<typeof formSchemas.expense>;

interface ExpenseFormProps {
  setIsOpen: (open: boolean) => void;
  transaction?: Transaction;
}

const ExpenseForm = ({ setIsOpen, transaction }: ExpenseFormProps) => {
  const transactionId = transaction?.id;

  const isUpdate = !!transactionId;

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
    invoices,
    loading: loadingInvoices,
    error: invoicesError,
  } = useInvoices();

  const loading = loadingAccounts || loadingCreditCards || loadingInvoices;
  const error = accountsError || creditCardsError || invoicesError;

  const defaultValues = {
    name: transaction?.name || "",
    amount: Number(transaction?.amount) || 0,
    expenseCategory:
      transaction?.expenseCategory || ExpenseTransactionCategory.FOOD,
    paymentMethod: transaction?.paymentMethod || TransactionPaymentMethod.DEBIT,
    accountId: transaction?.accountId || "",
    cardId: transaction?.cardId || "",
    invoiceId: transaction?.invoiceId || "",
    date: transaction?.date ? new Date(transaction?.date) : new Date(),
  };

  const form = useForm({
    resolver: zodResolver(formSchemas.expense),
    defaultValues,
  });

  const paymentMethod = form.watch("paymentMethod");
  const isCreditCard = paymentMethod === TransactionPaymentMethod.CREDIT;
  const selectedCardId = form.watch("cardId");
  const filteredInvoices = invoices?.filter(
    (invoice) => invoice.creditCardId === selectedCardId,
  );

  const onSubmit = async (data: FormSchema) => {
    try {
      if (isCreditCard) {
        delete data.accountId;
      } else {
        delete data.cardId;
        delete data.invoiceId;
      }
      await upsertExpenseTransaction({ ...data, id: transactionId });
      toast.success(
        `Transação ${isUpdate ? "atualizada" : "criada"} com sucesso!`,
      );
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error(`Erro ao ${isUpdate ? "atualizar" : "criar"} transação!`);
    }
  };

  if (error) return <div>{error}</div>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  onValueChange={({ floatValue }) => field.onChange(floatValue)}
                  onBlur={field.onBlur}
                  disabled={field.disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expenseCategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {EXPENSE_TRANSACTION_CATEGORY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
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
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Método de pagamento</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o metodo de pagamento..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TRANSACTION_PAYMENT_METHOD_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                        <div className="flex items-center space-x-5">
                          <Image
                            src={`/banks/${option.bank}.svg`}
                            alt={option.bank || "Banco"}
                            width={20}
                            height={20}
                          />
                          <span>{option.name}</span>
                        </div>
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
          <FormField
            control={form.control}
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

          <FormField
            control={form.control}
            name="invoiceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fatura</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={loadingInvoices || !selectedCardId}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a fatura..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredInvoices?.map((invoice) => (
                      <SelectItem key={invoice.id} value={invoice.id}>
                        {`${invoice.month}/${invoice.year}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </ShouldRender>

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

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" disabled={loading || !!error}>
            {isUpdate ? "Atualizar" : "Adicionar"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ExpenseForm;
