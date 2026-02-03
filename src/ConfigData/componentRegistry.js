/**
 * @fileoverview Component Registry - Central hub for all form field components
 * 
 * This module implements the **Open/Closed Principle** (SOLID) - the DynamicForm 
 * is open for extension (new field types) but closed for modification.
 * 
 * ## How It Works
 * 
 * 1. Each field in a form schema has a `type` property (e.g., "text", "select")
 * 2. DynamicForm looks up the component in this registry using the type
 * 3. The component is rendered with standardized props
 * 
 * ## Adding a New Component
 * 
 * 1. Create your component in `/Components/Form/YourComponent.jsx`
 * 2. Ensure it supports the standard interface (see below)
 * 3. Import it here and add a mapping
 * 
 * ## Standard Component Interface
 * 
 * All registered components MUST support these props:
 * 
 * | Prop | Type | Description |
 * |------|------|-------------|
 * | value | any | Current field value |
 * | onChange | function | Called when value changes |
 * | errors | string | Validation error message key |
 * | touched | boolean | Has field been interacted with |
 * | ResourcePage | string | Translation namespace |
 * | label | string | Label translation key |
 * | disabled | boolean | Disable the field |
 * | Required | boolean | Show required indicator |
 * 
 * ## Usage in Schema
 * 
 * ```javascript
 * {
 *   name: "vendorName",
 *   type: "text",           // <-- Maps to registry key
 *   label: "vendorName",    // <-- Translation key
 *   gridWidth: "col-span-6",
 *   validation: { required: true }
 * }
 * ```
 * 
 * @module ConfigData/componentRegistry
 * @author Tenders Team
 * @version 1.0.0
 */

import React from 'react';

// =============================================
// TEXT INPUT COMPONENTS
// =============================================
import CustomInput from '../Components/Form/CustomInput';
import CustomTextarea from '../Components/Form/CustomTextarea';
import OTPInput from '../Components/Form/OTPInput';

// =============================================
// SELECTION COMPONENTS
// =============================================
import CustomeSelect from '../Components/Form/CustomSelect';
import RadioGroup from '../Components/Form/RadioGroup';
import CardRadio from '../Components/Form/CardRadio';

// =============================================
// BOOLEAN/CHECKBOX COMPONENTS
// =============================================
import CustomCheckbox from '../Components/Form/CustomCheckbox';
import CardCheckbox from '../Components/Form/CardCheckbox';

// =============================================
// DATE/TIME COMPONENTS
// =============================================
import CustomDatePicker from '../Components/Form/CustomDatePicker';
import CustomDateRangePicker from '../Components/Form/CustomDateRangePicker';

/**
 * Component Registry - Maps field types to React components
 * 
 * @type {Object.<string, React.ComponentType>}
 * 
 * @example
 * // In DynamicForm.jsx:
 * const Component = componentRegistry[field.type];
 * return <Component {...fieldProps} />;
 */
export const componentRegistry = {
  // =========================================
  // TEXT INPUT TYPES
  // =========================================
  
  /**
   * Standard text input field
   * @see CustomInput
   */
  text: CustomInput,
  
  /**
   * Email input with email validation hint
   * Uses CustomInput with type="email"
   */
  email: (props) => <CustomInput {...props} type="email" />,
  
  /**
   * Password input with visibility toggle
   * Uses CustomInput with type="password"
   */
  password: (props) => <CustomInput {...props} type="password" />,
  
  /**
   * Numeric input with number keyboard on mobile
   * Uses CustomInput with type="number"
   */
  number: (props) => <CustomInput {...props} type="number" />,
  
  /**
   * Multi-line text area for longer content
   * @see CustomTextarea
   */
  textarea: CustomTextarea,
  
  /**
   * One-Time Password input (e.g., for verification codes)
   * @see OTPInput
   */
  otp: OTPInput,

  // =========================================
  // SELECTION TYPES
  // =========================================
  
  /**
   * Dropdown select with search functionality
   * Supports single and multi-select via `isMulti` prop
   * 
   * @example
   * // In schema:
   * {
   *   name: "vendorGroupId",
   *   type: "select",
   *   lookupKey: "vendorGroups",  // Maps to lookups object
   *   isMulti: false
   * }
   * 
   * @see CustomeSelect
   */
  select: CustomeSelect,
  
  /**
   * Radio button group for mutually exclusive options
   * Renders multiple CardRadio components
   * 
   * @example
   * // In schema:
   * {
   *   name: "status",
   *   type: "radioGroup",
   *   options: [
   *     { value: "active", label: "active" },
   *     { value: "inactive", label: "inactive" }
   *   ]
   * }
   * 
   * @see RadioGroup
   */
  radioGroup: RadioGroup,
  
  /**
   * Single card-style radio option
   * Used internally by RadioGroup, can also be used standalone
   * @see CardRadio
   */
  cardRadio: CardRadio,

  // =========================================
  // BOOLEAN/CHECKBOX TYPES
  // =========================================
  
  /**
   * Standard checkbox for boolean values
   * 
   * @example
   * // In schema:
   * { name: "isActive", type: "checkbox", label: "isActive" }
   * 
   * @see CustomCheckbox
   */
  checkbox: CustomCheckbox,
  
  /**
   * Card-style checkbox with larger click area
   * Good for mobile or prominent boolean toggles
   * @see CardCheckbox
   */
  cardCheckbox: CardCheckbox,

  // =========================================
  // DATE/TIME TYPES
  // =========================================
  
  /**
   * Date picker (date only, no time)
   * 
   * @example
   * // In schema:
   * {
   *   name: "startDate",
   *   type: "date",
   *   minDate: new Date()  // Can't select past dates
   * }
   * 
   * @see CustomDatePicker
   */
  date: CustomDatePicker,
  
  /**
   * Date range picker for selecting start and end dates
   * Returns an array: [startDate, endDate]
   * @see CustomDateRangePicker
   */
  dateRange: CustomDateRangePicker,
  
  /**
   * Date and time picker combined
   * Uses CustomDatePicker with viewTime=true
   */
  datetime: (props) => <CustomDatePicker {...props} viewTime />,

  // =========================================
  // FUTURE: ADVANCED TYPES
  // =========================================
  
  /**
   * Grid-based select (Microsoft Dynamics style)
   * Opens a full data grid in modal for selection
   * 
   * @todo Implement GridSelect component
   * @example
   * { name: "productId", type: "gridSelect", gridConfig: "Products" }
   */
  // gridSelect: GridSelect,
  
  /**
   * Nested field group for complex objects
   * Renders sub-fields in a grouped container
   * 
   * @todo Implement FieldGroup component
   * @example
   * {
   *   name: "address",
   *   type: "fieldGroup",
   *   fields: [
   *     { name: "street", type: "text" },
   *     { name: "city", type: "text" }
   *   ]
   * }
   */
  // fieldGroup: FieldGroup,
  
  /**
   * Repeater for array of objects
   * Add/remove items dynamically
   * 
   * @todo Implement Repeater component
   * @example
   * {
   *   name: "contacts",
   *   type: "repeater",
   *   minItems: 1,
   *   maxItems: 5,
   *   fields: [
   *     { name: "name", type: "text" },
   *     { name: "phone", type: "text" }
   *   ]
   * }
   */
  // repeater: Repeater,
};

/**
 * Gets a component from the registry by type
 * 
 * @param {string} type - The field type (e.g., "text", "select")
 * @returns {React.ComponentType|null} The component or null if not found
 * 
 * @example
 * const TextComponent = getComponent("text");
 * // Returns CustomInput
 */
export const getComponent = (type) => {
  const component = componentRegistry[type];
  if (!component) {
    console.warn(`[componentRegistry] Unknown field type: "${type}". Available types: ${Object.keys(componentRegistry).join(', ')}`);
    return null;
  }
  return component;
};

/**
 * Checks if a field type is registered
 * 
 * @param {string} type - The field type to check
 * @returns {boolean} True if the type is registered
 */
export const hasComponent = (type) => {
  return type in componentRegistry;
};

/**
 * Gets all registered field types
 * 
 * @returns {string[]} Array of registered type names
 */
export const getRegisteredTypes = () => {
  return Object.keys(componentRegistry);
};

export default componentRegistry;
