"use server";

import type { FormSchema } from "@components/transaction/forms/ExpenseForm";
import { v4 as uuid } from "uuid";
import { upsertExpenseTransaction } from "@actions/transactions/upsertExpenseTransaction";
import { db } from "@/app/_lib/prisma";
import { findOrOpenInvoice, revalidatePaths } from "./utils";
import { auth } from "@clerk/nextjs/server";

type HandleCreditTransactionProps = {
  transactionId?: string;
  data: FormSchema;
};

const handleCreditTransaction = async (props: HandleCreditTransactionProps) => {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  const { data, transactionId } = props;
  const { installmentType, installments } = data;

  // For the credit card transactions, removes the accountId and other data not used on the action
  delete data.installmentType;
  delete data.installments;
  delete data.accountId;

  // If the transaction doesn't have installments
  if (installmentType === "once") {
    await db.$transaction(async (prismaClient) => {
      const invoice = await findOrOpenInvoice({
        userId,
        cardId: data.cardId!,
        invoiceMonth: data.invoiceMonth!,
        invoiceYear: data.invoiceYear!,
        client: prismaClient,
      });

      // Removes the invoiceMonth and invoiceYear from the data, because they were already parsed
      delete data.invoiceMonth;
      delete data.invoiceYear;

      // Upserts a single transaction
      await upsertExpenseTransaction(
        {
          ...data,
          invoiceId: invoice.id,
          id: transactionId,
        },
        { revalidate: false, client: prismaClient },
      );
    });

    revalidatePaths();

    return;
  }

  // If the transaction has installments
  if (installmentType === "split") {
    await db.$transaction(
      async (prismaClient) => {
        // Checks if the transaction has at least 2 installments
        if (installments! < 2)
          throw new Error("At least 2 installments are required");

        // Sets initial invoice and installment values
        const transactionDate = new Date(data.date);
        const installmentId = uuid();
        const installmentAmount = data.amount / installments!;
        const installmentMonth = data.invoiceMonth!;
        const installmentYear = data.invoiceYear!;
        const installmentsTotal = installments!;

        // Removes the invoiceMonth and invoiceYear from the data, because they were already parsed
        delete data.invoiceMonth;
        delete data.invoiceYear;

        // Generates an array with the details for each installment
        const installmentDetails = Array.from({ length: installments! }).map(
          (_, index) => {
            const date = new Date(transactionDate);
            date.setMonth(date.getMonth() + index);

            const month = ((installmentMonth + index - 1) % 12) + 1;
            const year =
              installmentYear + Math.floor((installmentMonth + index - 1) / 12);

            return { date, month, year, number: index + 1 };
          },
        );

        // Generates a promise for each installment and runs them in parallel
        await Promise.all(
          installmentDetails.map(async (installment) => {
            // Finds or creates the corresponding invoice
            const installmentInvoice = await findOrOpenInvoice({
              userId,
              cardId: data.cardId!,
              invoiceMonth: installment.month,
              invoiceYear: installment.year,
              client: prismaClient,
            });

            // Creates the transaction linked to the correct invoice
            await upsertExpenseTransaction(
              {
                ...data,
                id: undefined,
                amount: installmentAmount,
                date: installment.date,
                invoiceId: installmentInvoice.id,
                installmentId,
                installmentNumber: installment.number,
                installmentsTotal,
              },
              { revalidate: false, client: prismaClient },
            );
          }),
        );
      },
      { timeout: 60000 },
    ); // This timeout is necessary to prevent the action from timing out
  }

  revalidatePaths();
};

export default handleCreditTransaction;
