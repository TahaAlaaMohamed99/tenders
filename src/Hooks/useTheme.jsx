import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCurrentLanguage, toggleTheme } from "../store/Reducers/Layout/themeSlice";


export function useTheme() {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeTheme = () => {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme === null) {
        const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        const defaultTheme = prefersDark ? "dark" : "light";
        dispatch(toggleTheme(defaultTheme));
        localStorage.setItem("theme", defaultTheme);
      } else {
        dispatch(toggleTheme(storedTheme));
      }
    };

    const initializeLanguage = () => {
      const storedLanguage = localStorage.getItem("language");
      if (storedLanguage === null) {
        const browserLanguage = navigator.language || navigator.languages[0] || "en";
        const language = browserLanguage.startsWith("ar") ? "ar" : "en";
        dispatch(setCurrentLanguage(language));
        localStorage.setItem("language", language);
      } else {
        dispatch(setCurrentLanguage(storedLanguage));
      }
    };

    const handleStorageChange = (e) => {
      if (e.key === "language") {
        dispatch(setCurrentLanguage(e.newValue || "en"));
      }
      if (e.key === "theme") {
        dispatch(toggleTheme(e.newValue || "light"));
      }
    };

    initializeTheme();
    initializeLanguage();

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [dispatch]);
}

