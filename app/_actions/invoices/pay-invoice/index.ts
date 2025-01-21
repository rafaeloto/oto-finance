"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { updateSingleAccountBalance } from "../../accounts/update-balance";

interface PayInvoiceParams {
  invoiceId: string;
  paymentAmount: number;
  paidByAccountId: string;
  paymentDate: Date;
}

export const payInvoice = async (params: PayInvoiceParams) => {
  const { invoiceId, paymentAmount, paidByAccountId, paymentDate } = params;

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Fetch the invoice to validate its existence and current status
  const invoice = await db.invoice.findUnique({
    where: { id: invoiceId },
  });

  if (!invoice) {
    throw new Error("Invoice not found");
  }

  if (invoice.status === "PAID") {
    throw new Error("Invoice is already paid");
  }

  if (invoice.status === "OPEN") {
    throw new Error("Invoice is still open");
  }

  if (!paymentAmount || paymentAmount <= 0) {
    throw new Error("Invalid payment amount");
  }

  // Group all operations in a single transaction, to apply transactional processing.
  await db.$transaction(async (transaction) => {
    // Update the invoice details
    await transaction.invoice.update({
      where: { id: invoiceId },
      data: {
        status: "PAID",
        paymentAmount,
        paymentDate,
        paidByAccountId,
      },
    });

    // Decrease the balance of the account used for payment
    await updateSingleAccountBalance({
      operation: "decrement",
      amount: paymentAmount,
      accountId: paidByAccountId,
      transaction,
    });
  });

  // Revalidate the necessary paths for UI updates
  revalidatePath("/");
  revalidatePath("/accounts");
  revalidatePath("/invoices");
  revalidatePath("/credit-cards/details");
};
