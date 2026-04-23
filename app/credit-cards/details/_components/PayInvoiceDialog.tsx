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
  FormDescription,
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
import Icon from "@atoms/Icon";
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
import { getLocalDate } from "@utils/date";
import ShouldRender from "@atoms/ShouldRender";

interface PayInvoiceDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  invoice: Invoice;
}

const formSchema = z
  .object({
    paymentAmount: z.number({
      required_error: "O valor do pagamento é obrigatório.",
    }),
    paymentDate: z.date().max(getLocalDate({ endOfDay: true }), {
      message: "A data do pagamento não pode ser futura.",
    }),
    paidByAccountId: z.string().optional(),
  })
  .refine(
    (data) => {
      // If payment amount is positive, account is required
      if (data.paymentAmount > 0) {
        return data.paidByAccountId && data.paidByAccountId.length > 0;
      }
      // If payment amount is negative or zero, account is not required
      return true;
    },
    {
      message: "Selecione uma conta para realizar o pagamento.",
      path: ["paidByAccountId"],
    },
  );

type FormSchema = z.infer<typeof formSchema>;

const PayInvoiceDialog = ({
  isOpen,
  setIsOpen,
  invoice,
}: PayInvoiceDialogProps) => {
  const {
    accounts,
    loading: loadingAccounts,
    error: accountsError,
  } = useAccounts();

  const { reload: reloadInvoices } = useInvoices();

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [formData, setFormData] = useState<FormSchema | null>(null);
  const [paying, setPaying] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentAmount: Number(invoice.totalAmount),
      paymentDate: getLocalDate({ noon: true }),
      paidByAccountId: "",
    },
  });

  const paymentAmountValue = form.watch("paymentAmount");
  const hasCreditBalance = paymentAmountValue < 0;
  const creditBalance = hasCreditBalance ? Math.abs(paymentAmountValue) : 0;

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

  const getAmountColorClass = (invoice: Invoice) => {
    if (Number(invoice.totalAmount) < 0) {
      return "text-primary";
    }
    return "text-danger";
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
                <p className={`text-2xl ${getAmountColorClass(invoice)}`}>
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
                        <FormLabel>
                          {hasCreditBalance
                            ? "Valor do crédito"
                            : "Valor do pagamento"}
                        </FormLabel>
                        <FormControl>
                          <MoneyInput
                            placeholder="Digite o valor..."
                            value={field.value}
                            onValueChange={({ floatValue }) =>
                              field.onChange(floatValue)
                            }
                            onBlur={field.onBlur}
                            disabled={field.disabled}
                            allowNegative={true}
                          />
                        </FormControl>
                        <FormDescription>
                          <ShouldRender if={hasCreditBalance}>
                            <div className="rounded-lg bg-green-50 p-3 dark:bg-green-950/20">
                              <p className="text-sm text-green-700 dark:text-green-400">
                                <Icon
                                  name="Info"
                                  className="mr-2 inline h-4 w-4"
                                />
                                Crédito de {formatCurrency(creditBalance)} será
                                transferido para a próxima fatura
                              </p>
                            </div>
                          </ShouldRender>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {hasCreditBalance
                            ? "Data da transferência"
                            : "Data do pagamento"}
                        </FormLabel>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <ShouldRender if={!hasCreditBalance}>
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
                                <Icon name="Loader2" className="animate-spin" />
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
                  </ShouldRender>
                </div>

                <DialogFooter className="flex gap-3 md:gap-0">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    disabled={loadingAccounts || !!accountsError}
                  >
                    {hasCreditBalance
                      ? "Transferir Crédito"
                      : "Registrar Pagamento"}
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
            <AlertDialogTitle>
              {hasCreditBalance
                ? "Confirmar transferência de crédito"
                : "Confirmar pagamento da fatura"}
            </AlertDialogTitle>

            <AlertDialogDescription>
              <ShouldRender if={hasCreditBalance}>
                Você está prestes a transferir um crédito de{" "}
                <strong className="text-primary">
                  {formatCurrency(Math.abs(formData?.paymentAmount || 0))}
                </strong>{" "}
                para a próxima fatura. Deseja continuar? Essa ação não pode ser
                desfeita.
              </ShouldRender>

              <ShouldRender if={!hasCreditBalance}>
                Você está prestes a pagar a fatura no valor de{" "}
                <strong className="text-danger">
                  {formatCurrency(formData?.paymentAmount || 0)}
                </strong>
                . Deseja continuar? Essa ação não pode ser desfeita.
              </ShouldRender>
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
                <Icon name="Loader2" className="animate-spin" />
              ) : hasCreditBalance ? (
                "Transferir Crédito"
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
