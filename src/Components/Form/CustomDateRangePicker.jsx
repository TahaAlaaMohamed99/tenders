import React, { useState } from "react";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import '../../Styles/Components/datePicker/DatePicker.css';
import TranslationText from "../TranslationText";
import { useSafeSelector } from "../../Hooks/useSafeSelector";

/**
 * CustomDateRangePicker Component:
 * Renders a customizable date range picker with floating label design.
 * Features a static label that sits on the border with a customizable background.
 * Uses Redux for language handling with prop override.
 * 
 * @param {boolean} touched - Validation touched state
 * @param {object} errors - Validation errors
 * @param {string} label - Label text
 * @param {boolean} Required - Shows asterisk if true
 * @param {string} className - Additional CSS classes
 * @param {Function} onBlur - Blur handler
 * @param {Function} onChange - Change handler
 * @param {array} value - Selected date range [startDate, endDate]
 * @param {Date} minDate - Minimum selectable date
 * @param {Date} maxDate - Maximum selectable date
 * @param {boolean} disabled - Disabled state
 * @param {string} ResourcePage - Translation resource page
 * @param {string} labelBgColor - Label background color
 * @param {string} lang - Language for translations (overrides Redux if provided)
 */

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
  ResourcePage = "",
  labelBgColor = "bg-bgWhite dark:bg-bgWhiteDark",
  lang
}) {
  const [isFocused, setIsFocused] = useState(false);
  
  // Redux language fallback
  const currentLanguage = useSafeSelector(
    (state) => state.themeSlice?.currentLanguage
  );
  const effectiveLang = lang || currentLanguage || "en";

  const handleBlur = (event) => {
    setIsFocused(false);
    if (onBlur) onBlur(event);
  };

  return (
    <div className={`w-full ${className || ""}`}>
      <div className="relative">
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
              ${touched && errors ? "text-error dark:text-errorDark" : ""}
            `}
          >
            <TranslationText title={label} page={ResourcePage} />
            {Required && <span className="icon_Required ml-0.5">*</span>}
          </label>
        )}
        
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
          locale={effectiveLang}
        />
      </div>

      {touched && errors && (
        <p className="input-error-msg">
          <TranslationText title={errors} page={ResourcePage} />
        </p>
      )}
    </div>
  );
}
