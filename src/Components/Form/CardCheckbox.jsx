import TranslationText from "../TranslationText";
import "../../Styles/Components/Checkbox/Checkbox.css";

/**
 * Custom checkbox component with a toggle effect.
 * 
 * @param {boolean} value - The current state of the checkbox (checked or unchecked).
 * @param {string} label - The label for the checkbox.
 * @param {Function} onChange - The function to handle checkbox state changes.
 * @param {string} className - Custom class names for additional styling.
 * @param {boolean} checked - Indicates whether the checkbox is checked or not.
 * @param {string} ResourcePage - The page used for translation.
 * @returns {JSX.Element} The rendered checkbox component.
 */
export default function CardCheckbox({
  value,
  label,
  onChange,
  disabled = false,
  className = "",
  checked = "",
  ResourcePage = "",
}) {
  return (
    <div
      // Toggles the checkbox state on click by passing the opposite of the current value
      onClick={() => !disabled && onChange(!value)}
      className={`form-check Card_Checkbox ${className} ${checked ? "active " :""} ${ disabled ? "disabled" : "default"}`}  // Add custom styles based on the checked state
    >
      {/* Render the label with translation support */}
      <label className="mb-0" htmlFor={label}>
        <TranslationText title={label} page={ResourcePage} />
      </label>

      <div className="checkbox-wrapper">
        {/* The actual checkbox input */}
        <input
          type="checkbox"
          className="input_checkbox peer"
          id="check"
          disabled={disabled}
          value={value}
          // Handles checkbox state change
          onChange={() => onChange(!value)}
          aria-label={label}
          checked={checked}  // The checkbox is checked if `checked` is true
        />

        {/* Checkbox icon, visible when the checkbox is checked */}
        <span className={"checkbox opacity-0 peer-checked:opacity-100"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
            viewBox="0 0 20 20"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth={1}
          >
            {/* Checkmark path */}
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}
