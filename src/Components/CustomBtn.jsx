import React from "react";
import TranslationText from "./TranslationText";
import { IconLoading, LoginDots } from "../assets/Icons/IconsSvg";
import "../Styles/Components/btn/btn.css";

/**
 * A reusable and customizable button component with loading and translation support.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.className - Additional custom classes for styling the button.
 * @param {string} [props.size="btn_lg"] - The size of the button (e.g., "btn_sm", "btn_md", "btn_lg").
 * @param {ReactNode} [props.icon] - Optional icon to display inside the button (left side).
 * @param {ReactNode} [props.iconEnd] - Optional icon to display inside the button (right side).
 * @param {string} props.title - The title or text for the button, used for display and translation.
 * @param {Function} props.onClick - The click handler function for the button.
 * @param {string} [props.type="button"] - The type of the button (e.g., "button", "submit", "reset").
 * @param {string} [props.ResourcePage=""] - The resource page identifier for translation purposes.
 * @param {boolean} [props.disabled=false] - Determines if the button should be disabled.
 * @param {boolean} [props.isLoading=false] - Determines if the button should display a loading state.
 * @param {boolean} [props.loginDots=false] - Shows decorative dots for login style buttons.
 * 
 * @returns {JSX.Element} - A styled button element with optional loading and icon support.
 */
export default function CustomBtn({
  className,
  size = "btn_lg",
  icon,
  iconEnd,
  title,
  onClick,
  type = "button",
  ResourcePage = "",
  disabled = false,
  isLoading = false,
  loginDots = false,
}) {
  // A mapping object for loading labels based on the button's title
  const labelLoading = {
    "save": "loadingSave",
    "edit": "loadingEdit",
  };

  return (
    <div className="relative">
    <button
      type={type} // Button type (e.g., "button", "submit")
      aria-label={title} // Accessibility label for screen readers
      disabled={disabled} // Disables the button if `disabled` is true
      onClick={!disabled && !isLoading ? onClick : undefined} // Prevents click handling when disabled or loading
      className={`btn ${size} ${className ?? ""} relative`}// Dynamically applies classes for styling
    >
      {isLoading ? (
        // Loading state: Show a spinner icon and a loading message
        <>
          <IconLoading className="w-4 h-4" /> {/* Loading spinner */}
          <TranslationText
            page="General"
            title={labelLoading[title] || "loading"} // Dynamically selects a loading message or defaults to "loading"
          />
        </>
      ) : (
        // Default state: Show optional icon and the translated title
        <>
          {icon && <span className="icon_btn">{icon}</span>} {/* Optional icon */}
          {title &&
          <span className={iconEnd ? "flex-1 text-start" : ""}>
          <TranslationText
            page={ResourcePage}
            title={title} // Displays the translated button title
          />
        </span>
          }
          {iconEnd && <span className="icon_btn_end">{iconEnd}</span>} {/* Optional trailing icon */}
          

        </>
      )}
    </button>
      {/* Decorative Dots - Sign-in Button */ }
    { loginDots &&
      <div className="absolute left-1/4 pointer-events-none">
        <LoginDots className="h-10 w-20 lg:h-12 lg:w-24" />
      </div>
    }
  </div>
  );
}
