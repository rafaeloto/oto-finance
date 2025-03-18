import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formSchemas } from "../formSchema";
import { useAccounts } from "@/app/_contexts/AccountsContext";
import { z } from "zod";
import { upsertInvestmentTransaction } from "@/app/_actions/transactions/upsert-investment-transaction";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../ui/form";
import { Input } from "../../../ui/input";
import { MoneyInput } from "../../../_atoms/money-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import { DatePicker } from "../../../ui/date-picker";
import { DialogClose, DialogFooter } from "../../../ui/dialog";
import { Button } from "../../../ui/button";
import { INVESTMENT_TRANSACTION_CATEGORY_OPTIONS } from "@/app/_constants/transaction";
import { InvestmentTransactionCategory, Transaction } from "@prisma/client";
import { ImageAndLabelOption } from "../../../_molecules/SelectOptions";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";

type FormSchema = z.infer<typeof formSchemas.investment>;

interface InvestmentFormProps {
  setIsOpen: (open: boolean) => void;
  transaction?: Transaction;
}

const InvestmentForm = ({ setIsOpen, transaction }: InvestmentFormProps) => {
  const transactionId = transaction?.id;

  const isUpdate = !!transactionId;

  const { accounts, loading, error } = useAccounts();

  const [upserting, setUpserting] = useState(false);

  const defaultValues = {
    name: transaction?.name || "",
    amount: Number(transaction?.amount) || 0,
    investmentCategory:
      transaction?.investmentCategory ||
      InvestmentTransactionCategory.INVESTMENT_POSITIVE_RETURN,
    accountId: transaction?.accountId || "",
    date: transaction?.date ? new Date(transaction?.date) : new Date(),
  };

  const form = useForm({
    resolver: zodResolver(formSchemas.investment),
    defaultValues,
  });

  const onSubmit = async (data: FormSchema) => {
    setUpserting(true);

    try {
      await upsertInvestmentTransaction({ ...data, id: transactionId });
      toast.success(
        `Transação ${isUpdate ? "atualizada" : "criada"} com sucesso!`,
      );
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error(`Erro ao ${isUpdate ? "atualizar" : "criar"} transação!`);
    } finally {
      setUpserting(false);
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
          name="investmentCategory"
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
                  {INVESTMENT_TRANSACTION_CATEGORY_OPTIONS.map((option) => (
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
          <Button
            type="submit"
            disabled={loading || upserting || !!error}
            className="min-w-24"
          >
            {upserting ? (
              <Loader2Icon className="animate-spin" />
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

export default InvestmentForm;
