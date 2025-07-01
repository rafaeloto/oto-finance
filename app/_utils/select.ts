import { getImportantDates } from "./date";

export const getMonthsOptions = () => {
  return [
    { value: "01", label: "Janeiro" },
    { value: "02", label: "Fevereiro" },
    { value: "03", label: "Março" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Maio" },
    { value: "06", label: "Junho" },
    { value: "07", label: "Julho" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
  ];
};

export const getYearsOptions = () => {
  const currentYear = getImportantDates().year;
  const startYear = 2024;
  const endYear = currentYear + 1;

  // Generates years from 2024 to the next year of the current year
  const years = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year.toString());
  }

  return years;
};
