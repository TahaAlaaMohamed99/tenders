import { useState, useEffect } from "react";

export default function useCurrencyOptions() {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=currencies")
      .then((res) => res.json())
      .then((data) => {
        const currencyMap = {};

        data.forEach((country) => {
          const currencies = country.currencies || {};

          Object.entries(currencies).forEach(([code, info]) => {
            if (!currencyMap[code]) {
              currencyMap[code] = {
                value: code,
                label: `${code} — ${info.name}`,
              };
            }
          });
        });

        setOptions(Object.values(currencyMap));
      })
      .catch((err) => console.error("Failed to fetch currencies:", err));
  }, []);

  return options;
}
