/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "Cairo"],
        cairo: ["Cairo", "Roboto"],
      },
      colors: {
        primary: "#333446",
        primaryDark: "#F4F4F4",
        titleColor: "#4B4C50",
        titleColorDark: "#E4E6E8",
        textColor: "#767577",
        textColorDark: "#717680",
        borderColor: "#ECEFF8",
        borderColorDark: "#3F4050",
        bgColor: "#F4F4F4",
        bgColorDark: "#333446",
        bgWhite: "#FFFFFF",
        bgWhiteDark: "#434343",
        success: "#00733B",
        error: "#D92D20",
        errorDark: "#F45B69",
        warning: "#EFBE12",
        disabled: "#E9EAEB",
        disabledDark: "#A4A7AE",
      },
      lineHeight: {
        "extra-loose": "normal",
      },
      boxShadow: {
        light: "none", // Was "0 0 10px 0 rgba(163, 162, 168, 0.25)",
        dark: "none", // Was "0 0 10px 0 rgba(0, 0, 0, 0.25)",
        custom: "none", // Was "0 0.1875rem 0.625rem 0 rgba(0, 11, 160, 0.09)",
        customDark: "none", // Was "0 0.1875rem 0.625rem 0 rgba(0, 11, 160, 0.1)",
        // Overriding default Tailwind shadows to be flat/none as requested
        sm: "none",
        DEFAULT: "none",
        md: "none",
        lg: "none",
        xl: "none",
        "2xl": "none",
        inner: "none",
      },
    },
  },
  darkMode: "selector",
  plugins: [],
};
