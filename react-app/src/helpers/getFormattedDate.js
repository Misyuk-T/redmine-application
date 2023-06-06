import { format } from "date-fns";

//21-06-2021
export const getFormattedStringDate = (date) => {
  if (!date) return;

  const dateObject = new Date(date);
  return format(dateObject, "dd-MM-yyyy");
};

//enable working DD/MM/YYYY for new Date
export const getCorrectGMTDateObject = (dateString) => {
  const [day, month, year] = dateString.split("-");

  return new Date(year, month - 1, day);
};
