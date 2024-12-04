import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formSchemas } from "./formSchema";
import { useAccounts } from "@/app/_contexts/AccountsContext";
import {
  ExpenseTransactionCategory,
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

type FormSchema = z.infer<typeof formSchemas.expense>;

interface ExpenseFormProps {
  setIsOpen: (open: boolean) => void;
  defaultValues?: FormSchema;
  transactionId?: string;
}

const ExpenseForm = ({
  defaultValues,
  transactionId,
  setIsOpen,
}: ExpenseFormProps) => {
  const isUpdate = !!transactionId;

  const { accounts, loading, error } = useAccounts();

  const form = useForm({
    resolver: zodResolver(formSchemas.expense),
    defaultValues: defaultValues ?? {
      name: "",
      amount: 0,
      expenseCategory: ExpenseTransactionCategory.FOOD,
      accountId: "",
      paymentMethod: TransactionPaymentMethod.DEBIT,
      date: new Date(),
    },
  });

  const onSubmit = async (data: FormSchema) => {
    try {
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

  if (loading) return <div>Carregando contas...</div>;
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
          name="accountId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conta</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o conta..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {accounts?.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
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
          <Button type="submit">{isUpdate ? "Atualizar" : "Adicionar"}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ExpenseForm;
