// Get current theme colors from Tailwind config
// This follows the exact colors defined in tailwind.config.js
const getColors = () => {
  const isDark = document.documentElement.classList.contains('dark');
  
  return {
    primary: isDark ? '#F4F4F4' : '#333446',
    titleColor: isDark ? '#E4E6E8' : '#4B4C50',
    textColor: isDark ? '#717680' : '#767577',
    borderColor: isDark ? '#3F4050' : '#ECEFF8',
    bgColor: isDark ? '#333446' : '#F4F4F4',
    bgWhite: isDark ? '#434343' : '#FFFFFF',
    success: '#00733B',
    error: isDark ? '#F45B69' : '#D92D20',
    warning: '#EFBE12',
    disabled: isDark ? '#A4A7AE' : '#E9EAEB',
  };
};

const CustomStyles = (errors, touched, isFocused, isSmall = false, isNoBorder = false) => {
  const colors = getColors();
  
  return {
    control: (provided, state) => ({
      ...provided,
      border: isNoBorder
        ? "none"
        : isFocused
        ? `1px solid ${colors.primary}`
        : touched && errors
          ? `1px solid ${colors.error}`
          : `1px solid ${colors.borderColor}`,
      boxShadow: "none",
      "&:hover": {
        borderColor: isNoBorder ? "transparent" : colors.primary,
      },
      padding: isSmall ? "0 0.75rem" : "0.5rem 1rem 0.25rem 1rem",
      margin: 0,
      height: isSmall ? "2rem" : "2.8125rem",
      minHeight: isSmall ? "2rem" : "2.8125rem",
      backgroundColor: state.isDisabled ? colors.disabled : colors.bgWhite,
      borderRadius: isSmall ? "0.375rem" : "0.75rem",
      opacity: state.isDisabled ? 0.6 : 1,
      cursor: state.isDisabled ? "not-allowed" : "default",
    }),
    placeholder: (provided, state) => ({
      ...provided,
      color: colors.textColor,
      fontSize: "0.875rem",
      fontWeight: "300",
      margin: "0",
      opacity: state.isDisabled ? 0.5 : 1,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? colors.bgColor 
        : colors.bgWhite,
      color: state.isSelected || state.isDisabled 
        ? colors.textColor 
        : colors.titleColor,
      fontSize: "0.875rem",
      fontWeight: state.isSelected ? "500" : "400",
      "&:hover": {
        backgroundColor: state.isDisabled ? "" : colors.bgColor,
        cursor: state.isDisabled ? "not-allowed" : "pointer",
      },
      padding: "0.5rem 0.75rem",
      borderRadius: "0.375rem",
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: colors.textColor,
      "&:hover": {
        color: colors.primary,
      },
      padding: "0",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      padding: "0",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    clearIndicator: (provided, state) => ({
      ...provided,
      color: colors.textColor,
      "&:hover": {
        color: colors.error,
      },
      cursor: "pointer",
      padding: "0 4px",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: colors.bgWhite,
      border: `1px solid ${colors.borderColor}`,
      padding: "0.25rem",
      fontSize: "0.875rem",
      zIndex: 9999,
      borderRadius: "0.75rem",
      marginTop: "0.25rem",
      opacity: 1,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    menuList: (provided) => ({
      ...provided,
      padding: "0.25rem",
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: colors.titleColor,
      fontWeight: "500",
      fontSize: "0.875rem",
      opacity: state.isDisabled ? 0.5 : 1,
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: colors.primary,
      borderRadius: "0.25rem",
      overflow: "hidden",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: colors.bgWhite,
      fontWeight: "600",
      fontSize: "0.875rem",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: colors.bgWhite,
      "&:hover": {
        backgroundColor: colors.primary,
        color: colors.error,
        cursor: "pointer",
      },
    }),
    input: (provided) => ({
      ...provided,
      color: colors.titleColor,
      margin: "0",
      padding: "0",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0",
    }),
  };
};

export default CustomStyles;
