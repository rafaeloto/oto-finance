import { useAccounts } from "@/app/_contexts/AccountsContext";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { Bank } from "@prisma/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { MoneyInput } from "@/app/_components/_atoms/money-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { BANK_OPTIONS } from "@/app/_constants/account";
import { createAccount } from "@/app/_actions/accounts/create-account";
import { toast } from "sonner";
import { ImageAndLabelOption } from "@/app/_components/_molecules/SelectOptions";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { ScrollArea } from "@/app/_components/ui/scroll-area";

interface CreateAccountDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const formSchema = z.object({
  name: z.string().trim().min(1, {
    message: "O nome é obrigatório",
  }),
  bank: z.nativeEnum(Bank, {
    required_error: "O banco é obrigatório",
  }),
  initialBalance: z.number().min(0, "O saldo inicial é obrigatório"),
});

type FormSchema = z.infer<typeof formSchema>;

const CreateAccountDialog = ({
  isOpen,
  setIsOpen,
}: CreateAccountDialogProps) => {
  const { reloadAccounts } = useAccounts();

  const [creating, setCreating] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      bank: Bank.NUBANK,
      initialBalance: 0,
    },
  });

  const onSubmit = async (data: FormSchema) => {
    setCreating(true);

    try {
      await createAccount({ ...data });
      await reloadAccounts();
      toast.success("Conta criada com sucesso!");
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar conta!");
    } finally {
      setCreating(false);
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
      <DialogContent className="flex h-[65svh] w-[85svw] max-w-lg flex-col py-8 pr-1">
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
              <div className="mb-8 flex-1 space-y-8">
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
                <Button type="submit" disabled={creating} className="min-w-24">
                  {creating ? (
                    <Loader2Icon className="animate-spin" />
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

export default CreateAccountDialog;
