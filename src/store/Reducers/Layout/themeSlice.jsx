import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentLanguage: "en",
  theme: "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setCurrentLanguage: (state, action) => {
      state.currentLanguage = action.payload;
      localStorage.setItem("language", action.payload);
      document.documentElement.dir = action.payload === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = action.payload === "ar" ? "ar" : "en";
    },
    toggleTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem("theme", action.payload);
      document.documentElement.classList.remove(action.payload == "dark" ? "light" : "dark");
      document.documentElement.classList.add(action.payload);
    },
  },
});

export const { setCurrentLanguage, toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
