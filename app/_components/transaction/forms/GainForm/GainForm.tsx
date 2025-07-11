import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formSchemas } from "../formSchema";
import { useAccounts } from "@contexts/AccountsContext";
import { Transaction } from "@prisma/client";
import { z } from "zod";
import { upsertGainTransaction } from "@actions/transactions/upsertGainTransaction";
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
import { useCategories } from "@contexts/CategoriesContext";
import { DatePicker } from "@shadcn/date-picker";
import { DialogClose, DialogFooter } from "@shadcn/dialog";
import { Button } from "@shadcn/button";
import { ImageAndLabelOption } from "@molecules/ImageAndLabelOption";
import { useState } from "react";
import Icon from "@atoms/Icon";
import CategoryField, {
  type openCategoryDialogProps,
} from "@components/category/CategoryField";
import { getLocalDate } from "@utils/date";

type FormSchema = z.infer<typeof formSchemas.gain>;

interface GainFormProps {
  setIsOpen: (open: boolean) => void;
  transaction?: Transaction;
  openCategoryDialog: (props: openCategoryDialogProps) => void;
}

const GainForm = ({
  setIsOpen,
  transaction,
  openCategoryDialog,
}: GainFormProps) => {
  const transactionId = transaction?.id;

  const isUpdate = !!transactionId;

  const {
    accounts,
    loading: loadingAccounts,
    error: accountsError,
  } = useAccounts();

  const {
    categories,
    loading: loadingCategories,
    error: categoriesError,
  } = useCategories("GAIN");

  const loading = loadingAccounts || loadingCategories;
  const error = accountsError || categoriesError;

  const [upserting, setUpserting] = useState(false);

  const defaultValues = {
    name: transaction?.name || "",
    amount: Number(transaction?.amount) || 0,
    categoryId: transaction?.categoryId || categories[0]?.id,
    accountId: transaction?.accountId || "",
    date: getLocalDate(transaction?.date),
  };

  const form = useForm({
    resolver: zodResolver(formSchemas.gain),
    defaultValues,
  });

  const onSubmit = async (data: FormSchema) => {
    setUpserting(true);

    try {
      await upsertGainTransaction({
        ...data,
        id: transactionId,
      });
      toast.success(`Ganho ${isUpdate ? "atualizado" : "criado"} com sucesso!`);
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error(`Erro ao ${isUpdate ? "atualizar" : "criar"} ganho!`);
    } finally {
      setUpserting(false);
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
            type="GAIN"
            openCategoryDialog={openCategoryDialog}
          />

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
                      <SelectValue placeholder="Selecione a conta..." />
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

export default GainForm;
