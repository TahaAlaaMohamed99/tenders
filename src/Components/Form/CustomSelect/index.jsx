import React, { useState } from "react";
import Select, { components } from "react-select";
import customStyles from "./CustomStyles";
import CustomStylesDark from "./CustomStylesDark";
import TranslationText from "../../TranslationText";
import {
  IconAddDoc,
  IconChevronDown,
  IconEdit,
  IconLoading,
} from "../../../assets/Icons";
import CustomBtn from "../../CustomBtn";
import { useNavigate } from "react-router-dom";
import { useSafeSelector } from "../../../Hooks/useSafeSelector";

/**
 * CustomeSelect Component:
 * This component renders a customizable select input using the 'react-select' library.
 * It handles multiple selections, custom styles, validation, and translations.
 * Features a static floating label that sits on the border with a customizable background.
 * Uses Redux for language handling with prop override.
 *
 * @param {boolean} isMulti - Determines whether the select allows multiple selections.
 * @param {array} options - The options to be displayed in the select dropdown.
 * @param {object} defaultValue - The default value selected when the component is first rendered.
 * @param {string} placeholder - Placeholder text shown when no value is selected.
 * @param {Function} onChange - Callback function to handle changes in selected values.
 * @param {object} value - The currently selected value(s).
 * @param {boolean} touched - Indicates if the field has been touched by the user (used for validation).
 * @param {object} errors - Validation errors for the field.
 * @param {Function} onBlur - Callback function triggered when the select input loses focus.
 * @param {string} label - The label to display for the select field.
 * @param {boolean} Required - Indicates if the field is required (displays asterisk if true).
 * @param {string} className - Custom CSS class for additional styling.
 * @param {string} menuPlacement - Defines the placement of the dropdown menu (default is "bottom").
 * @param {string} ResourcePage - The resource page used for translations.
 * @param {boolean} titleGenerallist - Flag for using a general list of titles for translation.
 * @param {string} labelBgColor - Custom background color for the label (e.g., "bg-white", "bg-gray-50"). Defaults to bgWhite/bgWhiteDark.
 * @param {string} lang - Language for translations (overrides Redux if provided)
 */
const CustomDropdownIndicator = (props) => {
  const { selectProps } = props;
  const isOpen = selectProps.menuIsOpen;
  return (
    <components.DropdownIndicator {...props}>
      <div className="flex items-center">
        {/* Fixed separator line */}
        <div className="h-6 w-px bg-borderColor dark:bg-borderColorDark mr-3" />
        {/* Rotating arrow */}
        {selectProps.isLoading ? (
          <IconLoading className="text-primary dark:text-primaryDark w-4 h-4" />
        ) : (
          <IconChevronDown 
            className={`w-4 h-4 text-textColor dark:text-textColorDark transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`} 
          />
        )}
      </div>
    </components.DropdownIndicator>
  );
};
const CustomeSelect = React.forwardRef(({
  isMulti,
  options,
  disabled = false,
  placeholder,
  onChange,
  value,
  touched,
  errors,
  onBlur,
  label,
  Required,
  className,
  menuPlacement = "bottom",
  ResourcePage = "",
  isClearable = false,
  titleGenerallist = false,
  isLoading = false,
  routeAddLookup = null,
  stateRoute,
  RecId = 0,
  setRecId,
  labelBgColor = "bg-bgColor dark:bg-bgColorDark",
  lang,
  isSmall,
}, ref) => {
  const navigate = useNavigate();
  // Custom input component for the react-select's Input component
  const CustomInput = (props) => {
    return (
      <components.Input {...props} autoComplete={`arkaan_Select${label}`} reference={ref} />
    );
  };

  // Extract the current theme (light/dark) from the Redux store
  // const { theme } = useSafeSelector((state) => state.themeSlice);

  // Redux language fallback
  const currentLanguage = useSafeSelector(
    (state) => state.themeSlice?.currentLanguage,
  );

  // State to track if the select component is focused
  const [isFocused, setIsFocused] = useState(false);

  // Handle focus event to set the select as focused
  const handleFocus = () => setIsFocused(true);

  // Handle blur event to reset focus and trigger onBlur prop if available
  const handleBlur = (event) => {
    setIsFocused(false);
    if (onBlur) onBlur(event);
  };

  return (
    <div className={`w-full ${className || ""}`}>
      <div className="relative">
        {/* Render floating label if provided */}
        {label && (
          <label
            htmlFor={`arkaan_${label}`}
            className={`
              input-label-floating z-10
              ${labelBgColor}
              ${
                isFocused
                  ? "text-primary dark:text-primaryDark"
                  : disabled
                    ? "text-textColor dark:text-textColorDark opacity-60"
                    : "text-titleColor dark:text-titleColorDark"
              }
              ${touched && errors ? "text-error dark:text-errorDark" : ""}
            `}
          >
            <TranslationText
              titleGenerallist={titleGenerallist}
              title={label}
              page={ResourcePage}
            />
            {Required && <span className="icon_Required ml-0.5">*</span>}
          </label>
        )}

        <div className="flex items-center gap-2">
          {/* Render the select input */}
          <Select
            ref={ref} // Attach the forwarded ref here
            isClearable={isClearable}
            options={options}
            isMulti={isMulti}
            components={{
              DropdownIndicator: CustomDropdownIndicator,
              Input: CustomInput, // Use the custom input component
            }}
            isLoading={isLoading}
            styles={customStyles(errors, touched, isFocused, isSmall)}
            placeholder={
              <TranslationText
                titleGenerallist={titleGenerallist}
                title={placeholder}
                page={ResourcePage}
              />
            }
            onChange={(e) => {
              onChange(e); // Pass the selected value to the onChange callback
              setIsFocused(false); // Reset the focus state after change
            }}
            isDisabled={disabled}
            className={routeAddLookup != null ? "flex-1" : "w-full"}
            value={value} // Set the selected value
            onBlur={handleBlur} // Handle blur event
            onFocus={handleFocus} // Handle focus event
            inputId={`arkaan_${label}`} // Unique id for the input field
            menuPlacement={menuPlacement} // Position the dropdown menu
            menuPortalTarget={document.body} // Render menu in portal to avoid overflow issues
            loadingMessage={() => <TranslationText title="loading" page="General" />}
            noOptionsMessage={() => <TranslationText title="noResults" page="General" />}
          />

          {routeAddLookup != null && (
            <CustomBtn
              icon={RecId > 0 ? <IconEdit /> : <IconAddDoc />}
              size="btn_sm"
              className="btn-primary min-w-min"
              onClick={() => {
                if (setRecId) {
                  setRecId(0);
                }
                navigate(routeAddLookup, {
                  state: {
                    controllerMode: true,
                    prevRoute: window.location.pathname,
                    RecId: RecId || 0,
                    statePrevRoute: stateRoute,
                  },
                });
              }}
            />
          )}
        </div>
      </div>

      {/* Show validation errors if the field is touched and has errors */}
      {touched && errors && (
        <p className="input-error-msg">
          <TranslationText
            titleGenerallist={titleGenerallist}
            title={errors}
            page={ResourcePage}
          />
        </p>
      )}
    </div>
  );
});

export default CustomeSelect;
