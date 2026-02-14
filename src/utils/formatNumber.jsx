const useFormatNumber = (number, language = "en") => {
  if (number == null || isNaN(number)) {
    return "";
  }

  const locale = language === "en" ? "en-US" : "ar-EG";

  const formatter = new Intl.NumberFormat(locale, {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(number);
};

export default useFormatNumber;
