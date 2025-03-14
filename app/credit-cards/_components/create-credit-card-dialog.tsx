import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/app/_components/ui/button";
import Image from "next/image";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { CreditCardFlag } from "@prisma/client";
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
import {
  CARD_COLORS_OPTIONS,
  CREDIT_CARD_OPTIONS,
} from "@/app/_constants/credit-card";
import { createCreditCard } from "@/app/_actions/credit-cards/create-credit-card";
import { toast } from "sonner";
import { useCreditCards } from "@/app/_contexts/CreditCardsContext";
import { useInvoices } from "@/app/_contexts/InvoicesContext";

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Cartão</DialogTitle>
          <DialogDescription>Insira as informações abaixo</DialogDescription>
        </DialogHeader>

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
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                          <div className="flex items-center space-x-5">
                            <Image
                              src={`/credit-cards/${option.value}.svg`}
                              alt={option.label || "Cartão"}
                              width={20}
                              height={20}
                            />
                            <span>{option.label}</span>
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

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit">Adicionar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCreditCardDialog;
