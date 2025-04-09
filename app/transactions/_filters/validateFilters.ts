import { z } from "zod";
import { TransactionPaymentMethod, TransactionType } from "@prisma/client";
import { getValidDateFromParams } from "@utils/date";

const searchParamsSchema = z.object({
  name: z.string().optional(),
  type: z.nativeEnum(TransactionType).optional(),
  paymentMethod: z.nativeEnum(TransactionPaymentMethod).optional(),
  accountId: z.string().optional(),
  cardId: z.string().optional(),
  month: z.string().optional(),
  year: z.string().optional(),
});

export type ValidSearchParams = z.infer<typeof searchParamsSchema>;

export const validateSearchParams = (
  params: Record<string, unknown>,
): ValidSearchParams => {
  const parsedParams = searchParamsSchema.safeParse(params);

  // Gets the valid month and year, considering fallback to the current ones
  const { validMonth, validYear } = getValidDateFromParams(
    params?.month as string,
    params?.year as string,
  );

  if (!parsedParams.success) {
    return { month: validMonth, year: validYear };
  }

  return {
    ...parsedParams.data,
    month: validMonth,
    year: validYear,
  };
};
