import React, { useState } from "react";
import TranslationText from "../TranslationText";
import { useSelector } from "react-redux";
import useTranslationText from "../../Hooks/useTranslationText";


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
  dir
}) {
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => setIsFocused(true);
  const currentLanguage = useSelector(
    (state) => state.themeSlice.currentLanguage
  );

  const handleBlur = (event) => {
    setIsFocused(false);
    if (onBlur) onBlur(event);
  };
  const textPlaceholder = useTranslationText({ page: ResourcePage, title: placeholder, lang: currentLanguage });
  return (
    <div
      className={`form-group ${touched && errors ? " error_group " : ""} ${className || ""
        }`}
    >
      {label && (
        <label htmlFor={`mega_${name}`} className={isFocused ? "focused" : disabled ? "disabled" : ""}>
          <TranslationText title={label} page={ResourcePage} />
          {Required ? (
            <span className="text-primary dark:text-primaryDark">*</span>
          ) : null}
        </label>
      )}
      <div className="relative">
        <textarea
          type="text"
          placeholder={
            textPlaceholder
          }
          dir={dir}
          disabled={disabled}
          value={value}
          onChange={disabled ? null : onChange}
          onFocus={disabled ? null : handleFocus}
          onBlur={disabled ? null : handleBlur}
          id={`mega_${name}`}
          autoComplete={autoComplete}
          className="input_textarea"
          name={name}
        />

      </div>

      {touched && errors && (
        <em className="error_text">
          <TranslationText title={errors} page={ResourcePage} />
        </em>
      )}
    </div>
  );
}
