import React, { useState, useRef, useEffect } from "react";
import Resources from "../../resources.json";
import TranslationText from "../TranslationText";
import { useSafeSelector } from "../../Hooks/useSafeSelector";

const OTPInput = React.forwardRef(({
  length = 6,
  value,
  onChange,
  onBlur,
  touched,
  errors,
  disabled = false,
  autoFocus = true,
  className = "",
  name,
  lang,
  ResourcePage = "",
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRefs = useRef(new Array(length).fill(null));
  
  // Redux language fallback
  const currentLanguage = useSafeSelector(
    (state) => state.themeSlice?.currentLanguage
  );
  const effectiveLang = lang || currentLanguage || "en";

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  // Combine parent ref and internal ref for the first input
  // This allows DynamicForm to focus the first OTP box
  const setFirstRef = (el) => {
      inputRefs.current[0] = el;
      if (typeof ref === 'function') ref(el);
      else if (ref) ref.current = el;
  };

  const handleChange = (index, inputValue) => {
    if (!/^\d*$/.test(inputValue)) return;

    const newOTP = value.split("");
    newOTP[index] = inputValue;
    const newOTPString = newOTP.join("");

    if (onChange) {
      onChange({ target: { name, value: newOTPString } });
    }

    if (inputValue && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (
      e.key === "Backspace" &&
      !value[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, length);

    if (/^\d+$/.test(pastedData)) {
      if (onChange) {
        onChange({ target: { name, value: pastedData.padEnd(length, "") } });
      }

      const lastFilledIndex = Math.min(pastedData.length - 1, length - 1);
      if (inputRefs.current[lastFilledIndex]) {
        inputRefs.current[lastFilledIndex].focus();
      }
    }
  };

  const handleFocus = () => setIsFocused(true);

  const handleBlur = (event) => {
    setIsFocused(false);
    if (onBlur) onBlur(event);
  };

  return (
    <div className={`w-full ${className || ""}`}>
      <div className="flex justify-between items-center gap-2">
        {Array.from({ length }, (_, index) => (
          <input
            key={index}
            // Use setFirstRef for the first element, otherwise just internal ref
            ref={index === 0 ? setFirstRef : (el) => (inputRefs.current[index] = el)}
            type="text"
            maxLength={1}
            value={value[index] || ""}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            id={index === 0 ? `arkaan_${name}` : undefined}
            name={`${name}_${index}`}
            className={`
              input-otp
              ${touched && errors 
                ? "border-error dark:border-errorDark" 
                : isFocused 
                  ? "border-primary dark:border-primaryDark shadow-custom dark:shadow-customDark" 
                  : "border-borderColor dark:border-borderColorDark"
              }
              ${disabled ? "opacity-60 cursor-not-allowed bg-disabled dark:bg-bgColorDark" : ""}
              focus:border-primary dark:focus:border-primaryDark
            `}
          />
        ))}
      </div>
      {touched && errors && (
        <p className="input-error-msg text-center">
          {effectiveLang ? (
            <TranslationText title={errors} page={ResourcePage} />
          ) : (
            errors
          )}
        </p>
      )}
    </div>
  );
});

export default OTPInput;
