import { useAccounts } from "@contexts/AccountsContext";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@shadcn/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shadcn/dialog";
import { Account, Bank } from "@prisma/client";
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
import { BANK_OPTIONS } from "@constants/account";
import { upsertAccount } from "@actions/accounts/upsertAccount";
import { toast } from "sonner";
import { ImageAndLabelOption } from "@molecules/ImageAndLabelOption";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { ScrollArea } from "@shadcn/scroll-area";

interface UpsertAccountDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  account?: Account;
}

const formSchema = z.object({
  name: z.string().trim().min(1, {
    message: "O nome é obrigatório",
  }),
  bank: z.nativeEnum(Bank, {
    required_error: "O banco é obrigatório",
  }),
  initialBalance: z.number({ required_error: "O saldo inicial é obrigatório" }),
});

type FormSchema = z.infer<typeof formSchema>;

const UpsertAccountDialog = ({
  isOpen,
  setIsOpen,
  account,
}: UpsertAccountDialogProps) => {
  const accountId = account?.id;

  const isUpdate = !!accountId;

  const { reloadAccounts } = useAccounts();

  const [upserting, setUpserting] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: account?.name || "",
      bank: account?.bank || Bank.NUBANK,
      initialBalance: Number(account?.initialBalance) || 0,
    },
  });

  const onSubmit = async (data: FormSchema) => {
    setUpserting(true);

    try {
      await upsertAccount({ ...data, id: accountId });
      await reloadAccounts();
      toast.success(`Conta ${isUpdate ? "atualizada" : "criada"} com sucesso!`);
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error(`Erro ao ${isUpdate ? "atualizar" : "criar"} conta!`);
    } finally {
      setUpserting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          form.reset();
        }
      }}
    >
      <DialogContent className="flex h-[65svh] w-[95svw] max-w-lg flex-col py-8 pr-1">
        <DialogHeader>
          <DialogTitle>Adicionar Conta</DialogTitle>
          <DialogDescription>Insira as informações abaixo</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-full pr-5">
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
                  name="initialBalance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Saldo inicial</FormLabel>
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

                <FormField
                  control={form.control}
                  name="bank"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banco</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o banco da conta..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {BANK_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <ImageAndLabelOption
                                src={`/banks/${option.value}.svg`}
                                label={option.label}
                              />
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                <Button type="submit" disabled={upserting} className="min-w-24">
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default UpsertAccountDialog;
