import React from "react";
import TranslationText from "../TranslationText";
import "../../Styles/Components/Checkbox/Checkbox.css";

/**
 * CustomCheckbox Component:
 * Renders a custom styled checkbox matching the application design.
 * Uses Tailwind CSS for styling, replacing external CSS files.
 * 
 * @param {boolean} value - Checkbox value
 * @param {string} label - Label text
 * @param {Function} onChange - Change handler
 * @param {boolean} checked - Checked state (overrides value if provided)
 * @param {string} ResourcePage - Translation resource page
 * @param {string} className - Additional CSS classes for wrapper
 * @param {boolean} disabled - Disabled state
 */
const CustomCheckbox = React.forwardRef(({
  value,
  label,
  onChange,
  checked = "",
  ResourcePage = "",
  className = "",
  disabled = false,
  touched,
  errors
}, ref) => {
  const isChecked = checked !== "" ? checked : value === true;

  return (
    <div className={`form-check flex flex-col ${className}`}>
      <div className="flex items-center gap-2">
        <div className="checkbox-wrapper relative flex items-center">
          <input
            ref={ref} // Forwarded ref
            type="checkbox"
            className={`
              input_checkbox peer relative h-5 w-5 appearance-none rounded border 
              bg-white dark:bg-bgWhiteDark 
              cursor-pointer transition-all duration-200 
              disabled:opacity-50 disabled:cursor-not-allowed
              ${touched && errors 
                ? "border-error dark:border-errorDark" 
                : "border-gray-300 dark:border-gray-600 checked:border-primary dark:checked:border-primary"
              }
              checked:bg-primary dark:checked:bg-primary
            `}
            id={`check_${label}`}
            value={value}
            aria-label={label}
            onChange={disabled ? null : onChange}
            checked={isChecked}
            disabled={disabled}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
            viewBox="0 0 20 20"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        {label && (
          <label 
            htmlFor={`check_${label}`}
            className={`
              text-sm font-medium cursor-pointer select-none 
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${touched && errors ? "text-error dark:text-errorDark" : "text-titleColor dark:text-titleColorDark"}
            `}
          >
            <TranslationText title={label} page={ResourcePage} />
          </label>
        )}
      </div>
      {touched && errors && (
        <p className="input-error-msg">
          <TranslationText title={errors} page={ResourcePage} />
        </p>
      )}
    </div>
  );
});

export default CustomCheckbox;
