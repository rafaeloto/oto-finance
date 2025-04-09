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
import { Invoice } from "@prisma/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shadcn/form";
import { MoneyInput } from "@atoms/MoneyInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shadcn/select";
import { toast } from "sonner";
import { useAccounts } from "@contexts/AccountsContext";
import { useInvoices } from "@contexts/InvoicesContext";
import { DatePicker } from "@shadcn/date-picker";
import { Loader2Icon } from "lucide-react";
import { formatCurrency } from "@utils/currency";
import { payInvoice } from "@actions/invoices/payInvoice";
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
} from "@shadcn/alert-dialog";
import { ImageAndLabelOption } from "@molecules/ImageAndLabelOption";
import { ScrollArea } from "@shadcn/scroll-area";

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
  const { reloadInvoices } = useInvoices();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [formData, setFormData] = useState<FormSchema | null>(null);
  const [paying, setPaying] = useState(false);

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

    setPaying(true);

    try {
      await payInvoice({
        invoiceId: invoice.id,
        ...formData,
      });
      await reloadInvoices();
      toast.success("Pagamento realizado com sucesso!");
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao registrar o pagamento!");
    } finally {
      setPaying(false);
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
        <DialogContent className="flex h-[75svh] w-[95svw] max-w-lg flex-col py-8 pr-1">
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

          <ScrollArea className="h-full pr-5">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleFormSubmit)}
                className="flex h-full flex-col"
              >
                <div className="mb-8 flex-1 space-y-8 px-1">
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
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                        />
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
                          disabled={loadingAccounts || !accounts?.length}
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
                </div>

                <DialogFooter className="flex gap-3 md:gap-0">
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
          </ScrollArea>
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
            <AlertDialogAction
              onClick={handleConfirmPayment}
              disabled={paying}
              className="min-w-24"
            >
              {paying ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                "Confirmar Pagamento"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PayInvoiceDialog;
