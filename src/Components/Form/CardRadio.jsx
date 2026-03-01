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
export default function CardRadio({
  value,
  label,
  onChange,
  disabled = false,
  className = "",
  checked = "",
  ResourcePage = "",
  icon
}) {
  return (
    <div
      // Toggles the checkbox state on click by passing the opposite of the current value
      onClick={() => !disabled && onChange(!value)}
      className={`form-check Card_Checkbox ${className} ${checked ? "active " :""} ${ disabled ? "disabled" : "default"}`}  // Add custom styles based on the checked state
    >
      {/* Render the label with translation support */}
      <label className="mb-0 flex items-center gap-1" htmlFor={label}>
      {icon && <span className="icon-container">{icon}</span>}
        <TranslationText title={label} page={ResourcePage} />
      </label>

      <div className="checkbox-wrapper">
        {/* The actual checkbox input */}

        <input
          type="radio"
          className="input_radio peer rounded-full"
          id="check"
          disabled={disabled}
          value={value}
          // Handles checkbox state change
          onChange={() => onChange(!value)}
          aria-label={label}
          checked={checked}  // The checkbox is checked if `checked` is true
        />
        {/* Checkbox icon, visible when the checkbox is checked */}
        <span className={"checkbox opacity-0 peer-checked:opacity-100 peer-checked:border-[0.25rem] peer-checked:border-bgWhite rounded-full "}>
        </span>
      </div>
    </div>
  );
}
