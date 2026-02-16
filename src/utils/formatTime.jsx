const formatTime = (value, lang = "en") => {
  if (!value) return "";

  let date;

  // Case 1: Full ISO date-time string
  if (value.includes("T")) {
    date = new Date(value);
  } else {
    // Case 2: Time-only string (e.g., "13:12:05")
    // Attach today's date to make it valid
    const today = new Date().toISOString().split("T")[0]; // e.g., "2025-05-19"
    date = new Date(`${today}T${value}`);
  }

  if (isNaN(date.getTime())) return "";

  const options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: lang === "en", // true for 12-hour, false for 24-hour
  };

  return new Intl.DateTimeFormat(lang, options).format(date);
};

export default formatTime;
