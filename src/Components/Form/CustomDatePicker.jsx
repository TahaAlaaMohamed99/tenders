import React, { useState } from "react";
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import TranslationText from "../TranslationText";
import { useSelector } from "react-redux";
import '../../Styles/Components/datePicker/DatePicker.css'
import { IconCalendar, Iconloading } from "../../assets/Icons/IconsSvg";
/**
 * CustomDatePicker Component:
 * This component renders a customizable date-time picker using 'react-datetime-picker'.
 * It handles the display of date and time, custom validation, translations, and various configuration options like min/max dates.
 * 
 * @param {boolean} touched - Indicates if the field has been touched by the user (used for validation).
 * @param {object} errors - Validation errors related to the field.
 * @param {string} label - The label to display for the date picker.
 * @param {boolean} Required - Indicates if the field is required (displays an asterisk if true).
 * @param {string} className - Custom CSS class for additional styling.
 * @param {Function} onBlur - Callback function triggered when the date picker input loses focus.
 * @param {Function} onChange - Callback function to handle changes in the selected date.
 * @param {object} value - The currently selected date value.
 * @param {object} minDate - The minimum allowed date for the date picker.
 * @param {object} maxDate - The maximum allowed date for the date picker.
 * @param {boolean} disabled - Flag to disable the date picker.
 * @param {boolean} viewTime - Flag to determine if time should be shown with the date.
 * @param {string} ResourcePage - The resource page used for translations.
 */
export default function CustomDatePicker({
  touched,
  errors,
  label,
  Required,
  className,
  onBlur,
  onChange,
  onClose,
  value,
  minDate,
  maxDate,
  disabled,
  viewTime = false,
  disableCalendar = false,
  ResourcePage = "",
  isLoading = false
}) {
  const [isFocused, setIsFocused] = useState(false);
  // Current language logic
  const currentLanguage = useSelector(
    (state) => state.themeSlice.currentLanguage
  );
  // Handle the blur event when the field loses focus
  const handleBlur = (event) => {
    setIsFocused(false);
    if (onBlur) onBlur(event);
  };

  return (
    <div className={`form-group ${errors ? "error_group" : ""} ${className || ""}`}>
      {/* Label for the date picker field */}
      <label className={isFocused ? "focused" : disabled ? "disabled" : ""}>
        <TranslationText title={label} page={ResourcePage} />
        {Required ? <span className="icon_Required">*</span> : null}
      </label>
      {/* DateTimePicker component */}
      <DateTimePicker
        onChange={onChange}               // Triggered when the date is changed
        value={value}                     // The current value of the date picker
        required={Required}               // Mark the field as required if true
        minDate={minDate || undefined}    // Minimum date that can be selected
        maxDate={maxDate || undefined}    // Maximum date that can be selected
        onFocus={() => setIsFocused(true)}// Set the field as focused when clicked
        onBlur={handleBlur}               // Triggered when the field loses focus
        onCalendarClose={onClose || null} // Triggered when the calendar is closed
        className="custom-date-picker  "    // Custom CSS class for styling
        disabled={disabled}               // Disable the date picker if true
        clearIcon={Required && null}       // Don't show the clear icon if required
        format={viewTime ? currentLanguage == "ar" ? "dd-MM-yyyy h:mm:ss a" : "yyyy-MM-dd h:mm:ss a" : currentLanguage == "ar" ? "yyyy-MM-dd" : "dd-MM-yyyy"}  // Date format (with or without time)
        disableClock={true}               // Disable the clock in the time picker
        locale={currentLanguage == "ar" ? "ar" : "en"}
        disableCalendar={disableCalendar}
        calendarIcon={isLoading ? <Iconloading className="text-primary dark:text-primaryDark" /> : <IconCalendar className="w-6 h-6" />}
      />

      {/* Display error message if the field has been touched and has errors */}
      {errors && <em className="error_text">{<TranslationText title={errors} page={ResourcePage} />}</em>}
    </div>
  );
}