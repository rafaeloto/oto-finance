import { Invoice, Prisma } from "@prisma/client";
import { createInvoice } from "@/app/_actions/credit-cards/create-invoice";
import { toast } from "sonner";
import { revalidatePath } from "next/cache";
import { db } from "@/app/_lib/prisma";

type FindOrOpenInvoiceProps = {
  userId: string;
  cardId: string;
  invoiceMonth: number;
  invoiceYear: number;
  client?: Omit<Prisma.TransactionClient, "$transaction">;
};

export const findOrOpenInvoice = async (
  props: FindOrOpenInvoiceProps,
): Promise<Invoice> => {
  const { userId, cardId, invoiceMonth, invoiceYear, client } = props;

  const prismaClient = client ?? db;

  // Checks if the invoice for the selected month and year already exists
  const existingInvoice = await prismaClient.invoice.findFirst({
    where: {
      userId,
      creditCardId: cardId,
      month: invoiceMonth,
      year: invoiceYear,
    },
  });

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
    transaction: client,
  });
};

export const revalidatePaths = () => {
  revalidatePath("/");
  revalidatePath("/transactions");
  revalidatePath("/credit-cards/details", "page");
};
