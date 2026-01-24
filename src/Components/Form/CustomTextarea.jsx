import React, { useState } from "react";
import TranslationText from "../TranslationText";
import useTranslationText from "../../Hooks/useTranslationText";
import { useSelector } from "react-redux";

/**
 * CustomTextarea Component:
 * Renders a customizable textarea with floating label design.
 * Features a static label that sits on the border with a customizable background.
 * Uses Redux for language handling with prop override.
 * 
 * @param {string} label - The label to display for the textarea
 * @param {string} value - Current value of the textarea
 * @param {string} placeholder - Placeholder text
 * @param {Function} onChange - Change handler
 * @param {Function} onBlur - Blur handler
 * @param {boolean} touched - Validation touched state
 * @param {object} errors - Validation errors
 * @param {boolean} disabled - Disabled state
 * @param {boolean} Required - Shows asterisk if true
 * @param {string} className - Additional CSS classes
 * @param {string} autoComplete - Autocomplete attribute
 * @param {string} name - Input name
 * @param {string} ResourcePage - Translation resource page
 * @param {string} dir - Text direction (ltr/rtl)
 * @param {string} lang - Language for translations (overrides Redux if provided)
 * @param {string} labelBgColor - Label background color (default: bgWhite/bgWhiteDark)
 */
export default function CustomTextarea({
  label,
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
  ResourcePage = "",
  dir,
  lang,
  labelBgColor = "bg-bgWhite dark:bg-bgWhiteDark"
}) {
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => setIsFocused(true);

  // Redux language fallback
  const currentLanguage = useSelector(
    (state) => state.themeSlice.currentLanguage
  );
  
  // Use prop lang if available, otherwise use Redux language, otherwise 'en'
  const effectiveLang = lang || currentLanguage || "en";

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
            <TranslationText title={label} page={ResourcePage} />
            {Required && (
              <span className="icon_Required ml-0.5">*</span>
            )}
          </label>
        )}
        
        <textarea
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
          className={`
            input-field-base min-h-[88px] resize-y
            ${touched && errors 
              ? "border-error dark:border-errorDark" 
              : isFocused 
                ? "border-primary dark:border-primaryDark" 
                : "border-borderColor dark:border-borderColorDark"
            }
            ${disabled ? "opacity-60 cursor-not-allowed bg-disabled dark:bg-bgColorDark" : ""}
          `}
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
