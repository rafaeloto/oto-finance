import { EXPENSE_MAP, GAIN_MAP } from "@constants/category";

/**
 * Checks if a given category is a loan category (either expense or gain type).
 *
 * @param {string} categoryId - The category id to check
 * @returns {boolean} True if the category is a loan, false otherwise
 */
export const isLoanCategory = (categoryId: string | undefined): boolean => {
  if (!categoryId) return false;
  return categoryId === EXPENSE_MAP.LOAN || categoryId === GAIN_MAP.LOAN;
};
