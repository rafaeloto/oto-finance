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
import { CreditCardFlag } from "@prisma/client";
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
import {
  CARD_COLORS_OPTIONS,
  CREDIT_CARD_OPTIONS,
} from "@constants/creditCard";
import { createCreditCard } from "@actions/creditCards/createCreditCard";
import { toast } from "sonner";
import { useCreditCards } from "@contexts/CreditCardsContext";
import { useInvoices } from "@contexts/InvoicesContext";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { ImageAndLabelOption } from "@molecules/ImageAndLabelOption";
import { ScrollArea } from "@shadcn/scroll-area";

interface CreateCreditCardDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const formSchema = z.object({
  name: z.string().trim().min(1, {
    message: "O nome é obrigatório",
  }),

  limit: z.number().positive().min(1, {
    message: "O limite é obrigatório e deve ser positivo",
  }),

  closingDate: z
    .number()
    .min(1, {
      message: "O fechamento da fatura deve ser um número de 1 a 31",
    })
    .max(31, {
      message: "O fechamento da fatura deve ser um número de 1 a 31",
    }),

  dueDate: z
    .number()
    .min(1, {
      message: "O vencimento da fatura deve ser um número de 1 a 31",
    })
    .max(31, {
      message: "O vencimento da fatura deve ser um número de 1 a 31",
    }),

  flag: z.nativeEnum(CreditCardFlag, {
    required_error: "A bandeira do cartão é obrigatória",
  }),

  color: z.string().min(1, {
    message: "Selecione uma cor para o cartão.",
  }),
});

type FormSchema = z.infer<typeof formSchema>;

const CreateCreditCardDialog = ({
  isOpen,
  setIsOpen,
}: CreateCreditCardDialogProps) => {
  const { reloadCreditCards } = useCreditCards();
  const { reloadInvoices } = useInvoices();

  const [creating, setCreating] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      limit: 0,
      closingDate: 5,
      dueDate: 15,
      flag: CreditCardFlag.AMEX,
    },
  });

  const onSubmit = async (data: FormSchema) => {
    setCreating(true);

    try {
      await createCreditCard({ ...data });
      await reloadCreditCards();
      await reloadInvoices();
      toast.success("Cartão criado com sucesso!");
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar cartão!");
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
      <DialogContent className="flex h-[85svh] w-[95svw] max-w-lg flex-col py-8 pr-1">
        <DialogHeader>
          <DialogTitle>Adicionar Cartão</DialogTitle>
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
                  name="limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Limite</FormLabel>
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
                  name="closingDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de fechamento da fatura</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Digite um dia de 1 a 31..."
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de vencimento da fatura</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Digite um dia de 1 a 31..."
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="flag"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bandeira</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a bandeira do cartão..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CREDIT_CARD_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <ImageAndLabelOption
                                src={`/credit-cards/${option.value}.svg`}
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

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cor</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a cor do cartão..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CARD_COLORS_OPTIONS.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                              <div className="flex items-center gap-3">
                                <span
                                  className={`h-5 w-5 rounded-full bg-gradient-to-r ${color.value}`}
                                />
                                <span>{color.label}</span>
                              </div>
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

export default CreateCreditCardDialog;
