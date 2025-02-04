import { format } from "date-fns";

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

  // Calculates the card cloding date
  const closingMonth =
    closingDay >= currentDay ? currentMonth : currentMonth + 1;
  const closingDate = new Date(currentYear, closingMonth, closingDay);

  // Calculates the card due date
  const dueMonth =
    dueDay > closingDay || closingDate.getMonth() !== currentMonth
      ? closingMonth
      : closingMonth + 1;
  const dueDate = new Date(currentYear, dueMonth, dueDay);

  return {
    closingDate: format(closingDate, "dd/MM"),
    dueDate: format(dueDate, "dd/MM"),
  };
};

export const getImportantDates = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
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
