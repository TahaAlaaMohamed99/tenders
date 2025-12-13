import React from "react";
import TranslationText from "../TranslationText";
import "../../Styles/Components/Checkbox/Checkbox.css";
export default function CustomCheckbox({
  value,
  label,
  onChange,
  checked = "",
  ResourcePage = "",
}) {
  return (
    <div className="form-check">
      <div className="checkbox-wrapper">
        <input
          type="checkbox"
          className="input_checkbox peer"
          id="check"
          value={value}
          aria-label={label}
          onChange={onChange}
          checked={checked != "" ? checked : value == true}
        />
        <span className={"checkbox opacity-0 peer-checked:opacity-100"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
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
        </span>
      </div>
      <label htmlFor={label}>
       <TranslationText title={label} page={ResourcePage} /> 
      </label>
    </div>
  );
}
