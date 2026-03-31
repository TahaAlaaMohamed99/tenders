/**
 * @fileoverview Grid Filter Utility
 *
 * Phase 5 refactor: Extracted duplicated filter logic from TendersGridContext
 * (~50 lines duplicated in useEffect and handleFilterGrid).
 *
 * @see docs/07-action-plan.md#6-deduplicate-filter-logic
 * @see docs/05-solid-clean-architecture.md (SRP Violation 3)
 * @module utils/gridFilters
 */

/**
 * Apply filter values to a data array.
 *
 * Supports:
 * - Date range objects `{ start, end }`
 * - Multi-select arrays `[{ value }, ...]`
 * - Select objects `{ value }`
 * - Plain string / number comparison (case-insensitive)
 *
 * @param {Array}  data    - Row data from the API
 * @param {Object} filters - { [fieldKey]: filterValue }
 * @param {Array}  [fields] - Explicit list of field keys to check. If omitted, derived from `filters`.
 * @returns {Array} Filtered rows
 */
export const applyGridFilters = (data, filters, fields) => {
  if (!data) return [];
  if (!filters || Object.keys(filters).length === 0) return data;

  const activeFields =
    fields ||
    Object.keys(filters).filter((key) => {
      const val = filters[key];
      if (val === "" || val == null) return false;
      if (typeof val === "object" && !Array.isArray(val) && val.start && val.end) return true;
      return val !== "" && val != null;
    });

  if (activeFields.length === 0) return data;

  return data.filter((row) =>
    activeFields.every((field) => {
      const filterValue = filters[field];
      if (!filterValue || filterValue === "") return true;

      const rowValue = row[field];
      if (rowValue == null) return false;

      // Date range { start, end }
      if (filterValue && typeof filterValue === "object" && !Array.isArray(filterValue)) {
        if (filterValue.start && filterValue.end) {
          const rowDate = new Date(rowValue);
          const startDate = new Date(filterValue.start);
          const endDate = new Date(filterValue.end);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);
          rowDate.setHours(0, 0, 0, 0);
          return rowDate >= startDate && rowDate <= endDate;
        }
        if (filterValue.value !== undefined) {
          return (
            rowValue === filterValue.value ||
            String(rowValue).toLowerCase() === String(filterValue.value).toLowerCase()
          );
        }
        return false;
      }

      // Multi-select array
      if (Array.isArray(filterValue)) {
        if (filterValue.length === 0) return true;
        return filterValue.some((fv) => {
          const fvValue = fv?.value !== undefined ? fv.value : fv;
          return (
            String(rowValue).toLowerCase() === String(fvValue).toLowerCase() ||
            String(rowValue).toLowerCase().includes(String(fvValue).toLowerCase())
          );
        });
      }

      // Select object { value }
      if (filterValue && typeof filterValue === "object" && filterValue.value !== undefined) {
        return (
          rowValue === filterValue.value ||
          String(rowValue).toLowerCase() === String(filterValue.value).toLowerCase()
        );
      }

      // String / number
      return String(rowValue).toLowerCase().includes(String(filterValue).toLowerCase());
    })
  );
};

/**
 * Maps frontend filter state values (including objects, arrays, and date ranges)
 * into the array format required by the backend `POST /FilterData` endpoint.
 *
 * @param {Object} filters - Frontend filter states
 * @returns {Array} - Array of objects formatted for backend: { field, operator, value, valueTo }
 */
export const mapFiltersToBackend = (filters) => {
  if (!filters) return [];

  return Object.keys(filters).reduce((acc, key) => {
    let val = filters[key];
    if (val === "" || val == null) return acc;

    // 1. Date range { start, end }
    if (typeof val === 'object' && !Array.isArray(val) && (val.start || val.end)) {
      acc.push({
        field: key,
        operator: 0,
        value: val.start ? String(val.start) : null,
        valueTo: val.end ? String(val.end) : null
      });
      return acc;
    }

    // 2. Multi-select lookup (Array of objects/values)
    if (Array.isArray(val)) {
      if (val.length === 0) return acc;
      // Many backends handle array values via IN operator or by repeating the filter.
      // Assuming a comma-separated string for multi-values or operator mapping. 
      // If the backend accepts a single string:
      const extractedValues = val.map(item => item?.value !== undefined ? String(item.value) : String(item));
      acc.push({
        field: key,
        operator: 0, // Ensure the backend handles `operator: 0` for comma-separated strings if multiple 
        value: extractedValues.join(","),
        valueTo: null
      });
      return acc;
    }

    // 3. Single select lookup ({ value, label })
    if (typeof val === 'object' && val.value !== undefined) {
      acc.push({
        field: key,
        operator: 0,
        value: String(val.value),
        valueTo: null
      });
      return acc;
    }

    // 4. Default: String/Number/Primitive
    acc.push({
      field: key,
      operator: 0,
      value: String(val),
      valueTo: null
    });

    return acc;
  }, []);
};
