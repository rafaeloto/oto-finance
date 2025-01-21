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
import { Invoice } from "@prisma/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { MoneyInput } from "@/app/_components/money-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { toast } from "sonner";
import { useAccounts } from "@/app/_contexts/AccountsContext";
import { DatePicker } from "@/app/_components/ui/date-picker";
import { Loader2Icon } from "lucide-react";
import { formatCurrency } from "@/app/_utils/currency";

interface PayInvoiceDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  invoice: Invoice;
}

const formSchema = z.object({
  paymentAmount: z
    .number()
    .min(0, { message: "O valor do pagamento deve ser no mínimo 0." }),
  paymentDate: z.date().max(new Date(), {
    message: "A data do pagamento não pode ser futura.",
  }),
  paidByAccountId: z.string().min(1, {
    message: "Selecione uma conta para realizar o pagamento.",
  }),
});

type FormSchema = z.infer<typeof formSchema>;

const PayInvoiceDialog = ({
  isOpen,
  setIsOpen,
  invoice,
}: PayInvoiceDialogProps) => {
  const { accounts, loading: loadingAccounts } = useAccounts();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentAmount: Number(invoice.totalAmount),
      paymentDate: new Date(),
      paidByAccountId: "",
    },
  });

  const onSubmit = async (data: FormSchema) => {
    try {
      // TODO: Add action to handle invoice payment.
      console.log(data);

      toast.success("Pagamento realizado com sucesso!");
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao registrar o pagamento!");
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
          <DialogTitle>
            <div className="flex flex-col gap-4 pb-4">
              Pagar Fatura: {invoice.month}/{invoice.year}
              <p className="text-2xl text-danger">
                {formatCurrency(Number(invoice.totalAmount))}
              </p>
            </div>
          </DialogTitle>
          <DialogDescription>
            Insira as informações do pagamento abaixo
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="paymentAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor do pagamento</FormLabel>
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
              name="paymentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data do pagamento</FormLabel>
                  <DatePicker value={field.value} onChange={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paidByAccountId"
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
                      {loadingAccounts && (
                        <Loader2Icon className="animate-spin" />
                      )}
                      {!loadingAccounts &&
                        accounts?.map((option) => (
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

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button disabled={loadingAccounts} type="submit">
                Registrar Pagamento
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PayInvoiceDialog;
