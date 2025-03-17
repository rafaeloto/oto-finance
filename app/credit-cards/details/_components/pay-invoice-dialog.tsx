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
import { Invoice } from "@prisma/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { MoneyInput } from "@/app/_components/_atoms/money-input";
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
import { payInvoice } from "@/app/_actions/invoices/pay-invoice";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/_components/ui/alert-dialog";
import { AccountOption } from "@/app/_components/_molecules/SelectOptions";

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
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [formData, setFormData] = useState<FormSchema | null>(null);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentAmount: Number(invoice.totalAmount),
      paymentDate: new Date(),
      paidByAccountId: "",
    },
  });

  const handleFormSubmit = (data: FormSchema) => {
    setFormData(data);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmPayment = async () => {
    if (!formData) return;

    try {
      payInvoice({
        invoiceId: invoice.id,
        ...formData,
      });

      toast.success("Pagamento realizado com sucesso!");
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao registrar o pagamento!");
    } finally {
      setIsConfirmDialogOpen(false);
    }
  };

  return (
    <>
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
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-8"
            >
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
                              <AccountOption
                                name={option.name}
                                bank={option.bank}
                              />
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

      <AlertDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar pagamento da fatura</AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a pagar a fatura no valor de{" "}
              <strong>{formatCurrency(formData?.paymentAmount || 0)}</strong>.
              Deseja continuar? Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmPayment}>
              Confirmar Pagamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PayInvoiceDialog;
