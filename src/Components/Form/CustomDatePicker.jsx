import React, { useState } from "react";
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import TranslationText from "../TranslationText";
import { useSafeSelector } from "../../Hooks/useSafeSelector";
import '../../Styles/Components/datePicker/DatePicker.css'
import { IconCalendar, Iconloading } from "../../assets/Icons/IconsSvg";
/**
 * CustomDatePicker Component:
 * This component renders a customizable date-time picker with floating label design.
 * Features a static label that sits on the border with a customizable background.
 * 
 * @param {boolean} touched - Indicates if the field has been touched by the user (used for validation).
 * @param {object} errors - Validation errors related to the field.
 * @param {string} label - The label to display for the date picker.
 * @param {boolean} Required - Indicates if the field is required (displays an asterisk if true).
 * @param {string} className - Custom CSS class for additional styling.
 * @param {Function} onBlur - Callback function triggered when the date picker input loses focus.
 * @param {Function} onChange - Callback function to handle changes in the selected date.
 * @param {Function} onClose - Callback when calendar closes.
 * @param {object} value - The currently selected date value.
 * @param {object} minDate - The minimum allowed date for the date picker.
 * @param {object} maxDate - The maximum allowed date for the date picker.
 * @param {boolean} disabled - Flag to disable the date picker.
 * @param {boolean} viewTime - Flag to determine if time should be shown with the date.
 * @param {boolean} disableCalendar - Flag to disable calendar.
 * @param {string} ResourcePage - The resource page used for translations.
 * @param {boolean} isLoading - Shows loading icon instead of calendar icon.
 * @param {string} lang - Language override (default: uses Redux state).
 * @param {string} labelBgColor - Label background color (default: bgWhite/bgWhiteDark).
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
  isLoading = false,
  lang,
  labelBgColor = "bg-bgWhite dark:bg-bgWhiteDark"
}) {
  const [isFocused, setIsFocused] = useState(false);
  // Current language logic - use prop or Redux (safe)
  const currentLanguage = useSafeSelector(
    (state) => state.themeSlice?.currentLanguage
  );
  const effectiveLanguage = lang || currentLanguage;
  
  // Handle the blur event when the field loses focus
  const handleBlur = (event) => {
    setIsFocused(false);
    if (onBlur) onBlur(event);
  };

  return (
    <div className={`w-full ${className || ""}`}>
      <div className="relative">
        {/* Floating label for the date picker field */}
        {label && (
          <label 
            className={`
              input-label-floating z-10
              ${labelBgColor}
              ${isFocused 
                ? "text-primary dark:text-primaryDark" 
                : disabled 
                  ? "text-textColor dark:text-textColorDark opacity-60" 
                  : "text-titleColor dark:text-titleColorDark"
              }
              ${errors ? "text-error dark:text-errorDark" : ""}
            `}
          >
            <TranslationText title={label} page={ResourcePage} />
            {Required && <span className="icon_Required ml-0.5">*</span>}
          </label>
        )}
        
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
          className="custom-date-picker"    // Custom CSS class for styling
          disabled={disabled}               // Disable the date picker if true
          clearIcon={Required && null}       // Don't show the clear icon if required
          format={viewTime ? effectiveLanguage == "ar" ? "dd-MM-yyyy h:mm:ss a" : "yyyy-MM-dd h:mm:ss a" : effectiveLanguage == "ar" ? "yyyy-MM-dd" : "dd-MM-yyyy"}  // Date format (with or without time)
          disableClock={true}               // Disable the clock in the time picker
          locale={effectiveLanguage == "ar" ? "ar" : "en"}
          disableCalendar={disableCalendar}
          calendarIcon={isLoading ? <Iconloading className="text-primary dark:text-primaryDark" /> : <IconCalendar className="w-6 h-6" />}
        />
      </div>

      {/* Display error message if the field has errors */}
      {errors && (
        <p className="input-error-msg">
          <TranslationText title={errors} page={ResourcePage} />
        </p>
      )}
    </div>
  );
}