import React, { useState } from "react";
import TranslationText from "../TranslationText";
import useTranslationText from "../../Hooks/useTranslationText";
import { useSafeSelector } from "../../Hooks/useSafeSelector";

/**
 * CustomInput Component:
 * This component renders a customizable input field with various types (e.g., text, password).
 * It handles validation, translations, and custom styling. It also includes a password visibility toggle for password fields.
 * Features a static floating label that sits on the border with a customizable background.
 * Uses Redux for language handling with prop override.
 * 
 * @param {string} label - The label to display for the input field.
 * @param {string} type - The type of the input (e.g., text, password, email, number).
 * @param {string} value - The current value of the input field.
 * @param {string} placeholder - Placeholder text shown when no value is entered.
 * @param {Function} onChange - Callback function to handle changes in the input value.
 * @param {Function} onBlur - Callback function triggered when the input loses focus.
 * @param {boolean} touched - Indicates if the field has been touched by the user (used for validation).
 * @param {object} errors - Validation errors related to the field.
 * @param {boolean} disabled - Flag to disable the input field.
 * @param {boolean} Required - Indicates if the field is required (displays an asterisk if true).
 * @param {string} className - Custom CSS class for additional styling.
 * @param {string} autoComplete - The autoComplete attribute for the input field.
 * @param {string} name - The name attribute of the input field.
 * @param {node} icon - The icon to display inside the input field (optional).
 * @param {string} ResourcePage - The resource page used for translations.
 * @param {string} dir - Text direction (ltr/rtl) for the input field.
 * @param {string} lang - Language setting for translations (overrides Redux if provided)
 * @param {ref} ref - React ref for the input element.
 * @param {string} labelBgColor - Custom background color for the label (e.g., "bg-white", "bg-gray-50"). Defaults to bgWhite/bgWhiteDark.
 */
const CustomInput = React.forwardRef(({
  label,
  type,
  value,
  placeholder,
  onChange,
  onBlur,
  touched,
  errors,
  disabled,
  Required,
  className,
  autoComplete,
  name,
  icon,
  ResourcePage = "",
  dir,
  lang,
  labelBgColor = "bg-bgWhite dark:bg-bgWhiteDark",
  ...props // Capture any other props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Redux language fallback
  const currentLanguage = useSafeSelector(
    (state) => state.themeSlice?.currentLanguage
  );
  const effectiveLang = lang || currentLanguage || "en";

  const handleFocus = () => setIsFocused(true);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleBlur = (event) => {
    setIsFocused(false);
    if (onBlur) onBlur(event);
  };
  const textPlaceholder = useTranslationText({ page: ResourcePage, title: placeholder, lang: effectiveLang });
  
  return (
    <div className={`w-full ${className || ""}`}>
      <div className="relative">
        {label && (
          <label 
            htmlFor={`arkaan_${name}`}
            className={`
              input-label-floating
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
            <TranslationText title={label}  />
            {Required && (
              <span className="icon_Required ml-0.5">*</span>
            )}
          </label>
        )}
        
        <input
          {...props} // Spread remaining props to input
          type={showPassword ? "text" : type}
          placeholder={textPlaceholder}
          dir={dir}
          disabled={disabled}
          value={value}
          onChange={disabled ? null : onChange}
          onFocus={disabled ? null : handleFocus}
          onBlur={disabled ? null : handleBlur}
          id={`arkaan_${name}`}
          autoComplete={autoComplete}
          name={name}
          ref={ref} // Forwarded Ref
          className={`
            input-field-base
            ${touched && errors 
              ? "border-error dark:border-errorDark" 
              : isFocused 
                ? "border-primary dark:border-primaryDark" 
                : "border-borderColor dark:border-borderColorDark"
            }
            ${disabled ? "opacity-60 cursor-not-allowed bg-disabled dark:bg-bgColorDark" : ""}
            ${type === "password" || icon ? "pr-12" : ""}
          `}
        />
        
        {type === "password" && (
          <button
            type="button"
            onClick={handleShowPassword}
            className="
              absolute right-4 top-1/2 -translate-y-1/2
              text-textColor dark:text-textColorDark
              hover:text-titleColor dark:hover:text-titleColorDark
              transition-colors duration-200
              w-5 h-5 flex items-center justify-center
              focus:outline-none
            "
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg
                viewBox="64 64 896 896"
                focusable="false"
                data-icon="eye"
                width="20"
                height="20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z" />
              </svg>
            ) : (
              <svg
                viewBox="64 64 896 896"
                focusable="false"
                data-icon="eye-invisible"
                width="20"
                height="20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M942.2 486.2Q889.47 375.11 816.7 305l-50.88 50.88C807.31 395.53 843.45 447.4 874.7 512 791.5 684.2 673.4 766 512 766q-72.67 0-133.87-22.38L323 798.75Q408 838 512 838q288.3 0 430.2-300.3a60.29 60.29 0 000-51.5zm-63.57-320.64L836 122.88a8 8 0 00-11.32 0L715.31 232.2Q624.86 186 512 186q-288.3 0-430.2 300.3a60.3 60.3 0 000 51.5q56.69 119.4 136.5 191.41L112.48 835a8 8 0 000 11.31L155.17 889a8 8 0 0011.31 0l712.15-712.12a8 8 0 000-11.32zM149.3 512C232.6 339.8 350.7 258 512 258c54.54 0 104.13 9.36 149.12 28.39l-70.3 70.3a176 176 0 00-238.13 238.13l-83.42 83.42C223.1 637.49 183.3 582.28 149.3 512zm246.7 0a112.11 112.11 0 01146.2-106.69L401.31 546.2A112 112 0 01396 512z"></path>
                <path d="M508 624c-3.46 0-6.87-.16-10.25-.47l-52.82 52.82a176.09 176.09 0 00227.42-227.42l-52.82 52.82c.31 3.38.47 6.79.47 10.25a111.94 111.94 0 01-112 112z"></path>
              </svg>
            )}
          </button>
        )}
        
        {icon && (
          <span className="
            absolute right-4 top-1/2 -translate-y-1/2
            text-textColor dark:text-textColorDark
            w-5 h-5 flex items-center justify-center
          ">
            {icon}
          </span>
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

export default CustomInput;
