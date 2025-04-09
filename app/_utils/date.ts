import { format, isMatch } from "date-fns";
import { MONTH_NAMES } from "@constants/month";

/**
 * Calculates the card closing and due dates based on the current date and the
 * given closing day and due day.
 *
 * The closing date will be the given closing day of the current month if the
 * current day is before the closing day, otherwise it will be the given closing
 * day of the next month.
 *
 * The due date will be the given due day of the same month as the closing date
 * if the given due day is after the closing day, otherwise it will be the given
 * due day of the next month.
 *
 * Both dates are returned in the format "dd/MM".
 *
 * @param closingDay The day of the month when the card closes.
 * @param dueDay The day of the month when the card is due.
 * @returns An object containing the calculated closing and due dates.
 */
export const calculateClosingAndDueDates = (
  closingDay: number,
  dueDay: number,
): { closingDate: string; dueDate: string } => {
  const {
    day: currentDay,
    month: currentMonth,
    year: currentYear,
  } = getImportantDates(new Date());

  // Calculates the card's closing date
  let closingMonth = closingDay >= currentDay ? currentMonth : currentMonth + 1;
  let closingYear = currentYear;

  if (closingMonth > 12) {
    closingMonth = 1;
    closingYear += 1;
  }

  const closingDate = new Date(closingYear, closingMonth - 1, closingDay);

  // Calculates the card's due date
  let dueMonth = closingMonth;
  let dueYear = closingYear;

  if (closingDay > dueDay) {
    dueMonth += 1;
    if (dueMonth > 12) {
      dueMonth = 1;
      dueYear += 1;
    }
  }

  const dueDate = new Date(dueYear, dueMonth - 1, dueDay);

  return {
    closingDate: format(closingDate, "dd/MM"),
    dueDate: format(dueDate, "dd/MM"),
  };
};

export const getImportantDates = (date?: Date) => {
  const validDate = date ?? new Date();

  const day = validDate.getDate();
  const month = validDate.getMonth() + 1;
  const year = validDate.getFullYear();
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = year + 1;
  const nextMonthYear = month === 12 ? nextYear : year;

  return {
    day,
    month,
    year,
    nextMonth,
    nextYear,
    nextMonthYear,
  };
};

export const getValidDateFromParams = (month?: string, year?: string) => {
  // Gets the current month and year as strings
  const currentMonth = String(getImportantDates().month).padStart(2, "0");
  const currentYear = String(getImportantDates().year);

  // Verifies if month and year are valid
  const monthIsInvalid = !month || !isMatch(month, "MM");
  const yearIsInvalid = !year || !/^\d{4}$/.test(year);

  // If the parameters are invalid, use the current date values
  const validMonth = monthIsInvalid ? currentMonth : month;
  const validYear = yearIsInvalid ? currentYear : year;

  return { validMonth, validYear };
};

/**
 * Gets the options for a Select component with the values of the
 * invoice months based on the selected date, closing and due day.
 *
 * @param selectedDate - The date that the user has selected.
 * @param closingDay - The day of the month that the invoice is closed.
 * @param dueDay - The day of the month that the invoice is due.
 * @returns An array of objects with the value, label and year of the
 * invoice options.
 */
export const getInvoiceOptions = (
  selectedDate: Date,
  closingDay: number,
  dueDay: number,
): { value: number; label: string; year: number }[] => {
  const {
    day: selectedDay,
    month: selectedMonth,
    year: selectedYear,
  } = getImportantDates(selectedDate);

  let firstInvoiceMonth = selectedMonth;
  let firstInvoiceYear = selectedYear;

  // If the selected day is greater than the closing day,
  // the first invoice should be one month later, because the
  // invoice month refers to the month the invoice is paid
  if (selectedDay > closingDay) {
    firstInvoiceMonth += 1;
    if (firstInvoiceMonth > 12) {
      firstInvoiceMonth = 1;
      firstInvoiceYear += 1;
    }
  }

  // If the closingDay day is greater than the dueDay,
  // the first invoice should be one month later
  if (closingDay > dueDay) {
    firstInvoiceMonth += 1;
    if (firstInvoiceMonth > 12) {
      firstInvoiceMonth = 1;
      firstInvoiceYear += 1;
    }
  }

  let secondInvoiceMonth = firstInvoiceMonth + 1;
  let secondInvoiceYear = firstInvoiceYear;
  if (secondInvoiceMonth > 12) {
    secondInvoiceMonth = 1;
    secondInvoiceYear += 1;
  }

  return [
    {
      value: firstInvoiceMonth,
      label: MONTH_NAMES[firstInvoiceMonth],
      year: firstInvoiceYear,
    },
    {
      value: secondInvoiceMonth,
      label: MONTH_NAMES[secondInvoiceMonth],
      year: secondInvoiceYear,
    },
  ];
};
