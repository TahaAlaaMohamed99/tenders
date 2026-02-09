/**
 * cellFormatters.js — Formatter Registry (Phase 7, P3 #15 — OCP)
 * ================================================================
 * Open/Closed Principle: Add new column formatters by registering them here,
 * without modifying `formatDataGrid.jsx`.
 *
 * Each formatter receives:
 *   { value, column, row, currentLanguage, className, routeKey, helpers }
 *
 * `helpers` contains shared utilities:
 *   { formatDate, formatNumber, formatTime, Resources, Generallists,
 *     buildRouteAddEdit, stopPropagation, CellAvatar, StatusCell }
 *
 * A formatter MUST return a JSX element or null.
 *
 * @example Adding a new "percentage" formatter:
 *   // In this file or via registerFormatter():
 *   registerFormatter("percentage", ({ value, className }) => (
 *     <p className={className}>{(value * 100).toFixed(1)}%</p>
 *   ));
 *
 * @see docs/05-solid-clean-architecture.md — OCP: formatDataGrid
 */

// ────────── registry ──────────
const registry = {};

/**
 * Register a cell formatter for a given column type.
 *
 * @param {string}   type      – Column type string (e.g. "date", "salary", "percentage")
 * @param {function} formatter – ({ value, column, row, currentLanguage, className, routeKey, helpers }) => JSX | null
 */
export const registerFormatter = (type, formatter) => {
  if (typeof type !== "string" || typeof formatter !== "function") {
    console.error(`[cellFormatters] Invalid registration: type="${type}"`);
    return;
  }
  registry[type] = formatter;
};

/**
 * Retrieve the formatter for a column type.
 *
 * @param {string} type – Column type
 * @returns {function|undefined}
 */
export const getFormatter = (type) => registry[type];

/**
 * Check whether a custom formatter is registered for a type.
 *
 * @param {string} type
 * @returns {boolean}
 */
export const hasFormatter = (type) => type in registry;

export default registry;
