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
        primary: "#008080",
        primaryDark: "#b2d8d8",
        titleColor: "#0B0B0B",
        titleColorDark: "#F7FCFB",
        textColor: "#A2A1A8",
        textColorDark: "#717680",
        borderColor: "#E9EAEC",
        borderColorDark: "#3a3c3d",
        bgColor: "#F7FCFB",
        bgColorDark: "#1c1c1d",
        bgWhite: "#fff",
        bgWhiteDark: "#252728",
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
        light: "0 0 10px 0 rgba(163, 162, 168, 0.25)", // Light shadow
        dark: "0 0 10px 0 rgba(0, 0, 0, 0.25)", // Dark shadow
        custom: "0 0.1875rem 0.625rem 0 rgba(0, 11, 160, 0.09)",
        customDark: "0 0.1875rem 0.625rem 0 rgba(0, 11, 160, 0.1)",
      },
    },
  },
  darkMode: "selector",
  plugins: [],
};
