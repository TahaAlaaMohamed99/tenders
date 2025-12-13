import React, { useState } from "react";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import '../../Styles/Components/datePicker/DatePicker.css'

export default function CustomDateRangePicker({
  touched,
  errors,
  label,
  Required,
  className,
  onBlur,
  onChange,
  value,
  minDate,
  maxDate,
  disabled,
}) {
  const [isFocused, setIsFocused] = useState(false);

  const handleBlur = (event) => {
    setIsFocused(false);
    if (onBlur) onBlur(event);
  };

  return (
    <div
      className={`form-group ${touched && errors ? "error_group" : ""} ${
        className || ""
      }`}
    >
      <label className={isFocused ? "focused" : ""}>
        {label} {Required ? <span className="icon_Required">*</span> : null}
      </label>
      <DateRangePicker
        onChange={onChange}
        value={value}
        minDate={minDate}
        maxDate={maxDate}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        className="custom-date-picker"
        disabled={disabled}
        format="d/M/y"
      />
      {touched && errors && <em className="error_text">{errors}</em>}
    </div>
  );
}
