const CustomStyles = (errors, touched, isFocused) => ({
    control: (provided) => ({
      ...provided,
      border: isFocused
        ? "0.12rem solid #1c64f2"
        : touched && errors
        ? "0.12rem solid #ea5455"
        : "0.12rem solid #3a3c3d",
      boxShadow: isFocused
        ? "0 0.1875rem 0.625rem 0 rgba(0, 182, 190, 0.1)"
        : "none",
      "&:hover": {
        borderColor: "#1c64f2",
        boxShadow: "0 0.1875rem 0.625rem 0 rgba(0, 182, 190, 0.1)",
      },
      padding: "0.375rem 0.5rem",
      margin: 0,
      maxHeight: "2.8125rem",
      minHeight: "2.8125rem",
      backgroundColor: "#252728",
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
    option: (provided, state) => ({
      ...provided,
      backgroundColor: "#252728",
      color: state.isSelected || state.isDisabled ? "#717680" : "#F0F4FF",
      fontSize: "0.875rem",
      fontWeight: "400",
      "&:hover": {
        backgroundColor: "#1c1c1d",
        cursor: state.isDisabled ? "not-allowed" :"pointer",
      },
      padding: "0.5rem",
      borderRadius:"0.375rem"
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: isFocused ? "#1c64f2" : "#717680",
      "&:hover": {
        color: "#1c64f2",
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
      color: isFocused ? "#1c64f2" : "#A2A1A8",
      "&:hover": {
        color: "#1c64f2",
      },
      cursor: "pointer",
      padding: "0",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#252728",
      border:"0.03125rem solid #3a3c3d",
      padding:"0.25rem",
      fontSize: "0.875rem",
      zIndex: 9999999, // Must be above ActionModal (999999)
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999999, // Must be above ActionModal (999999)
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#F0F4FF",
      fontWeight: "500",
      fontSize: "0.875rem",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#1c64f2",
      borderRadius: "0.25rem",
      color: "#1c64f2",
      overflow: "hidden"
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#A2A1A8",
      fontWeight: "600",
      fontSize: "0.875rem",
    }),
    multiValueRemove: (provided, state) => ({
      ...provided,
      color: "#A2A1A8",
      "&:hover": {
        backgroundColor: "#1c64f2",
        color: "#A2A1A8",
        cursor: "pointer",
      },
    }),
  });
  
  export default CustomStyles;
  