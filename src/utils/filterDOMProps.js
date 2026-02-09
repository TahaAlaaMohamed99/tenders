/**
 * filterDOMProps.js — Safe DOM Prop Filtering Utility
 * =====================================================
 * Filters out React/custom props that should not be spread onto native DOM elements.
 *
 * React warns when non-standard props (like `titleGenerallist`, `isLoading`, etc.)
 * are spread onto native HTML elements like <input>, <div>, etc.
 *
 * This utility provides a clean, maintainable way to filter props before spreading.
 *
 * @see https://react.dev/learn/passing-props-to-a-component#forwarding-props-with-the-jsx-spread-syntax
 * @see https://github.com/facebook/react/blob/main/packages/react-dom-bindings/src/shared/DOMProperty.js
 */

/**
 * Known non-DOM props used in this codebase that should be filtered out.
 * These are custom props for configuration, metadata, or component-specific logic.
 */
const NON_DOM_PROPS = new Set([
  // Form field metadata (from FormSchemas / DynamicForm)
  "gridWidth",
  "lookup",
  "validation",
  "required", // lowercase version (uppercase Required is for label asterisk)
  "isNumber",
  "titleGenerallist",
  "isLoading",
  "ResourcePage",
  "forceLightMode",
  "isSmall",
  "labelBgColor",
  "Required", // uppercase (used for asterisk display)
  "icon",
  "lang",

  // Grid column metadata (from GridSchemas)
  "isFilterSelect",
  "generallist",
  "lookupName",
  "keysLookup",
  "keyGetLookup",
  "secondKey",
  "secondKeyText",
  "ConfigPage",
  "keyRecId",
  "isDimension",
  "StatusList",
  "isFilter",
  "docViwe",
  "stepper",
  "maxWidth",
  "minWidth",
  "fixed",
  "hiddenShow",
  "hidden",
  "hiddenMobile",
  "checkbox",

  // React-specific
  "key",
  "ref",
  "children",

  // Other custom props
  "touched",
  "errors",
]);

/**
 * Filter out non-DOM props from an object.
 *
 * @param {Object} props - Props object to filter
 * @returns {Object} - Filtered props safe to spread onto DOM elements
 *
 * @example
 * const { label, type, ...rest } = props;
 * const domProps = filterDOMProps(rest);
 * return <input {...domProps} type={type} />;
 */
export const filterDOMProps = (props) => {
  const filtered = {};
  for (const key in props) {
    if (!NON_DOM_PROPS.has(key)) {
      filtered[key] = props[key];
    }
  }
  return filtered;
};

/**
 * Alternative: Extract only known-safe DOM input attributes.
 * This is more restrictive but guarantees no warnings.
 *
 * @param {Object} props - Props object
 * @returns {Object} - Only standard HTML input attributes
 */
export const extractInputProps = (props) => {
  const {
    // Standard HTML input attributes
    accept,
    alt,
    autoComplete,
    autoFocus,
    capture,
    checked,
    defaultChecked,
    defaultValue,
    disabled,
    form,
    formAction,
    formEncType,
    formMethod,
    formNoValidate,
    formTarget,
    height,
    list,
    max,
    maxLength,
    min,
    minLength,
    multiple,
    name,
    pattern,
    placeholder,
    readOnly,
    required,
    size,
    src,
    step,
    type,
    value,
    width,
    // Event handlers
    onChange,
    onBlur,
    onFocus,
    onKeyDown,
    onKeyUp,
    onKeyPress,
    onClick,
    // ARIA attributes
    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedby,
    "aria-invalid": ariaInvalid,
    "aria-required": ariaRequired,
    // Data attributes (all data-* are safe)
    ...rest
  } = props;

  const inputProps = {
    accept,
    alt,
    autoComplete,
    autoFocus,
    capture,
    checked,
    defaultChecked,
    defaultValue,
    disabled,
    form,
    formAction,
    formEncType,
    formMethod,
    formNoValidate,
    formTarget,
    height,
    list,
    max,
    maxLength,
    min,
    minLength,
    multiple,
    name,
    pattern,
    placeholder,
    readOnly,
    required,
    size,
    src,
    step,
    type,
    value,
    width,
    onChange,
    onBlur,
    onFocus,
    onKeyDown,
    onKeyUp,
    onKeyPress,
    onClick,
    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedby,
    "aria-invalid": ariaInvalid,
    "aria-required": ariaRequired,
  };

  // Include data-* attributes
  Object.keys(rest).forEach((key) => {
    if (key.startsWith("data-")) {
      inputProps[key] = rest[key];
    }
  });

  // Remove undefined values
  Object.keys(inputProps).forEach((key) => {
    if (inputProps[key] === undefined) {
      delete inputProps[key];
    }
  });

  return inputProps;
};

export default filterDOMProps;
