"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { updateSingleAccountBalance } from "@actions/accounts/updateBalance";
import { upsertCreditReturnTransaction } from "@actions/transactions/upsertCreditReturnTransaction";
import { GAIN_MAP } from "@constants/category";
import { getLocalDate } from "@utils/date";

interface PayInvoiceParams {
  invoiceId: string;
  paymentAmount: number;
  paidByAccountId?: string;
  paymentDate: Date;
}

export const payInvoice = async (params: PayInvoiceParams) => {
  const { invoiceId, paymentAmount, paidByAccountId, paymentDate } = params;

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Fetches the invoice to validate its existence and current status
  const invoice = await db.invoice.findUnique({
    where: { id: invoiceId },
    include: { creditCard: true },
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

  if (isNaN(paymentAmount)) {
    throw new Error("Invalid payment amount");
  }

  // Check if invoice has negative total (credit balance)
  const creditBalance = paymentAmount < 0 ? Math.abs(paymentAmount) : 0;

  // Groups all operations in a single transaction, to apply transactional processing.
  await db.$transaction(async (transaction) => {
    // Handle credit balance transfer if invoice has negative total
    if (creditBalance > 0) {
      // Calculate next month
      let nextMonth = invoice.month + 1;
      let nextYear = invoice.year;

      if (nextMonth > 12) {
        nextMonth = 1;
        nextYear += 1;
      }

      // Create automatic credit transaction on next month's invoice
      await upsertCreditReturnTransaction(
        {
          name: "Reembolso de crédito da fatura anterior",
          amount: creditBalance,
          categoryId: GAIN_MAP.CASHBACK,
          cardId: invoice.creditCardId,
          invoiceMonth: nextMonth,
          invoiceYear: nextYear,
          date: getLocalDate({ noon: true }),
        },
        { revalidate: false, client: transaction },
      );
    }

    // Updates the invoice details
    await transaction.invoice.update({
      where: { id: invoiceId },
      data: {
        status: "PAID",
        paymentAmount,
        paymentDate,
        paidByAccountId: paidByAccountId || null,
      },
    });

    // Decreases the balance of the account used for payment (only for actual payments)
    if (paymentAmount > 0 && paidByAccountId) {
      await updateSingleAccountBalance({
        operation: "decrement",
        amount: paymentAmount,
        accountId: paidByAccountId,
        transaction,
      });
    }
  });

  // Revalidates the necessary paths for UI updates
  revalidatePath("/");
  revalidatePath("/accounts");
  revalidatePath("/invoices");
  revalidatePath("/credit-cards/details", "page");
};
