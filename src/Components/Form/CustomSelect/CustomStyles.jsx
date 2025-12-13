const CustomStyles = (errors, touched, isFocused) => ({
  control: (provided) => ({
    ...provided,
    border: isFocused
      ? "0.12rem solid #000ba0"
      : touched && errors
        ? "0.12rem solid #ea5455"
        : "0.12rem solid #E9EAEC",
    boxShadow: isFocused
      ? "0 0.1875rem 0.625rem 0 rgba(0, 182, 190, 0.1)"
      : "none",
    "&:hover": {
      borderColor: "#000ba0",
      boxShadow: "0 0.1875rem 0.625rem 0 rgba(0, 182, 190, 0.1)",
    },
    padding: "0.375rem 0.5rem",
    margin: 0,
    maxHeight: "2.8125rem",
    minHeight: "2.8125rem",
    backgroundColor: "#fff",
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    padding: "0",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#A2A1A8",
    fontSize: "0.875rem",
    fontWeight: "300",
    margin: "0",
  }),

  option: (provided, state) => {
    return {
      ...provided,
      backgroundColor: "#fff",
      color: state.isSelected || state.isDisabled ? "#717680" : "#0B0B0B",
      fontSize: "0.875rem",
      fontWeight: "400",
      "&:hover": {
        backgroundColor: state.isDisabled ? "" : "#F0F4FF",
        cursor: state.isDisabled ? "not-allowed" : "pointer",
      },
      padding: "0.5rem",
      borderRadius: "0.375rem"
    }

  },
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: isFocused ? "#000ba0" : "#A2A1A8",
    "&:hover": {
      color: "#000ba0",
    },
    padding: "0",
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    backgroundColor: "#A2A1A8",
    cursor: "pointer",
  }),
  clearIndicator: (provided, state) => ({
    ...provided,
    color: isFocused ? "#000ba0" : "#A2A1A8",
    "&:hover": {
      color: "#000ba0",
    },
    cursor: "pointer",
    padding: "0",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#fff",
    border: "0.03125rem solid #E9EAEC",
    padding: "0.25rem",
    fontSize: "0.875rem",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#0B0B0B",
    fontWeight: "500",
    fontSize: "0.875rem",
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#000ba0",
    borderRadius: "0.25rem",
    color: "#000ba0",
    overflow: "hidden"
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#F0F4FF",
    fontWeight: "600",
    fontSize: "0.875rem",
  }),
  multiValueRemove: (provided, state) => ({
    ...provided,
    color: "#F0F4FF",
    "&:hover": {
      backgroundColor: "#000ba0",
      color: "#F0F4FF",
      cursor: "pointer",
    },
  }),
});

export default CustomStyles;
