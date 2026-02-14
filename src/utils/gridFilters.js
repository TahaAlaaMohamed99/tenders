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
