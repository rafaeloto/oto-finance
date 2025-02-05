import { FormSchema } from "@/app/_components/transaction/forms/ExpenseForm/ExpenseForm";
import { Invoice } from "@prisma/client";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";
import { createInvoice } from "../../../../../_actions/credit-cards/create-invoice";
import { upsertExpenseTransaction } from "../../../../../_actions/transactions/upsert-expense-transaction";

type FindOrOpenInvoiceProps = {
  invoices: Invoice[];
  cardId: string;
  invoiceMonth: number;
  invoiceYear: number;
};

const findOrOpenInvoice = async (
  props: FindOrOpenInvoiceProps,
): Promise<Invoice> => {
  const { invoices, cardId, invoiceMonth, invoiceYear } = props;

  // Checks if the invoice for the selected month and year already exists
  const existingInvoice = invoices.find(
    (inv) =>
      inv.creditCardId === cardId &&
      inv.month === invoiceMonth &&
      inv.year === invoiceYear,
  );

  if (existingInvoice) {
    // If the invoice exists and is already paid, prevents the creation of the transaction
    if (existingInvoice.status === "PAID") {
      toast.error("Não é possível adicionar transações a uma fatura já paga.");
      throw new Error("Invoice is already paid");
    }
    // Returns the existing invoice
    return existingInvoice;
  }

  // Creates and returns a new invoice if it doesn't exist
  return await createInvoice({
    creditCardId: cardId,
    month: invoiceMonth,
    year: invoiceYear,
  });
};

type HandleCreditTransactionProps = {
  transactionId?: string;
  data: FormSchema;
  invoices: Invoice[];
  selectedYear: number;
};

const handleCreditTransaction = async (props: HandleCreditTransactionProps) => {
  const { data, invoices, transactionId, selectedYear } = props;
  const { installmentType, installments } = data;
  const availableInvoices = [...invoices];

  // For the credit card transactions, removes the accountId and other data not used on the action
  delete data.installmentType;
  delete data.installments;
  delete data.accountId;

  // If the transaction doesn't have installments
  if (installmentType === "once") {
    const invoice = await findOrOpenInvoice({
      cardId: data.cardId!,
      invoiceMonth: data.invoiceMonth!,
      invoiceYear: selectedYear,
      invoices,
    });

    // Removes the invoiceMonth from the data, because it was already parsed
    delete data.invoiceMonth;

    // Upserts a single transaction
    await upsertExpenseTransaction({
      ...data,
      invoiceId: invoice.id,
      id: transactionId,
    });
    return;
  }

  // If the transaction has installments
  if (installmentType === "split") {
    // Checks if the transaction has at least 2 installments
    if (installments! < 2)
      throw new Error("At least 2 installments are required");

    // Sets initial invoice and installment values
    const transactionDate = new Date(data.date);
    const installmentId = uuid();
    const installmentAmount = data.amount / installments!;
    let installmentMonth = data.invoiceMonth!;
    let installmentYear = selectedYear;
    let installmentNumber = 1;

    // Removes the invoiceMonth from the data, because it was already parsed
    delete data.invoiceMonth;

    for (let i = 0; i < installments!; i++) {
      // Finds or creates the corresponding invoice
      const installmentInvoice = await findOrOpenInvoice({
        cardId: data.cardId!,
        invoiceMonth: installmentMonth,
        invoiceYear: installmentYear,
        invoices: availableInvoices,
      });

      // Create transaction for each installment
      await upsertExpenseTransaction({
        ...data,
        id: undefined, // Installments are new transactions
        amount: installmentAmount,
        date: new Date(transactionDate),
        invoiceId: installmentInvoice.id,
        installmentId,
        installmentNumber,
      });

      availableInvoices.push(installmentInvoice);

      // Adjusts the next installment month and year
      if (installmentMonth === 12) {
        installmentMonth = 1;
        installmentYear++;
      } else {
        installmentMonth++;
      }

      // Adjusts the next installment number and date
      installmentNumber++;
      transactionDate.setMonth(transactionDate.getMonth() + 1);
    }
  }
};
export default handleCreditTransaction;
