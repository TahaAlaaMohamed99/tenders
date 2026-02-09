import dayjs from "dayjs";
import "dayjs/locale/ar";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { getLocalStorageAtob } from "./localStorage";

// Enable required plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const config = getLocalStorageAtob("Configuration");

// Set default timezone
const DEFAULT_TIMEZONE = config?.TIMEZONE;

export const useFormatDate = (
  date,
  currentLanguage = "en",
  includeTime = false
) => {
  // Check if the date is empty or undefined
  if (!date) return ""; // If the date is not provided, return an empty string

  // Set the locale of dayjs to the current language
  const localizedDayjs = dayjs(date)
    .locale(currentLanguage)
    ?.tz(DEFAULT_TIMEZONE);
 
  // Define the date format strings
  const dateFormat = currentLanguage === "ar" ? "YYYY/MM/DD" : "DD/MM/YYYY";
  const dateTimeFormat =
    currentLanguage === "ar" ? "YYYY/MM/DD HH:mm A" : "DD/MM/YYYY hh:mm A";

  // Return the formatted date with or without time based on includeTime
  return localizedDayjs.format(includeTime ? dateTimeFormat : dateFormat);
};

export const parseAPIDate = (dateString) => {
  if (!dateString) return null;
  return dayjs(dateString).tz(DEFAULT_TIMEZONE).toDate();
};

export const formatDateForAPI = (date) => {
  if (!date) return null;
  return dayjs(date).utc().tz(DEFAULT_TIMEZONE).format("YYYY-MM-DDTHH:mm:ss");
};
export const formatDateOnlyForAPI = (date) => {
  if (!date) return null;
  return dayjs(date).utc().tz(DEFAULT_TIMEZONE).format("YYYY-MM-DD");
};
export const getCurrentDate = (format = "YYYY-MM-DD HH:mm:ss") => {
  return dayjs().tz(DEFAULT_TIMEZONE).format(format);
};
