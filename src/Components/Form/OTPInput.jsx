import React, { useState, useRef, useEffect } from "react";
import Resources from "../../resources.json";
import TranslationText from "../TranslationText";

const OTPInput = ({
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
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRefs = useRef(new Array(length).fill(null));

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

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
    <div
      className={`form-group  ${touched && errors ? "error_group" : ""} ${
        className || ""
      }`}
    >
      <div className="flex-content-between gap-2">
        {Array.from({ length }, (_, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            maxLength={1}
            value={value[index] || ""}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            id={index === 0 ? `mega_${name}` : undefined}
            name={`${name}_${index}`}
            className="input_text opt_input text-center"
          />
        ))}
      </div>
      {touched && errors && (
        <em className="error_text">
          {lang ? (
            <TranslationText title={errors} page={ResourcePage} />
          ) : (
            errors
          )}
        </em>
      )}
    </div>
  );
};

export default OTPInput;
