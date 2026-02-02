import { memo } from "react";
 

/**
 * IMPORTANT: These format functions should NOT be hooks
 * They should be imported from utility files as regular functions
 */
import { useFormatDate } from "./useFormatDate";
import useFormatNumber from "./useFormatNumber";
import useFormatTime from "./useFormatTime";

/**
 * Builds route for add/edit pages
 */
const buildRouteAddEdit = (config, recId) => {
  if (!config || config.keyPage === "Dashboard") return null;

  const basePath = config.keyModule
    ? `/${config.keyModule}`
    : config.showMenu === "menuReportSetup"
      ? "/Setups"
      : "";

  const subPath = config.subModule ? `/${config.subModule}` : "";
  const routePath = `/${config.routePage}`;
  const editPath = config.routeAddEdit
    ? `/${recId > 0 ? "edit" : "add"}/${recId}${config.Stepper ? `/${btoa(0)}` : ""}`
    : "";

  return `${basePath}${subPath}${routePath}${editPath}`;
};

/**
 * Get initials from name
 */
const getInitials = (value) => {
  return value
    .split(" ")
    .slice(0, 2)
    .map(word => word[0])
    .join("");
};

/**
 * Memoized Avatar Component
 */
const CellAvatar = memo(({ value, imageKey, secondKeyText }) => {
  const initials = getInitials(value);

  return (
    <div className="cell-avatar">
      <span className="cell-avatar__image">
        {imageKey ? (
          <img
            src={imageKey}
            alt={value}
            className="w-full h-full rounded-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="cell-avatar__fallback">
            <span className="cell-avatar__initials">{initials}</span>
          </div>
        )}
      </span>
      <div className="cell-avatar__content">
        <span className="cell-avatar__title text_ellipsis">{value}</span>
        {secondKeyText && (
          <span className="cell-avatar__subtitle">{secondKeyText}</span>
        )}
      </div>
    </div>
  );
});

CellAvatar.displayName = "CellAvatar";



/**
 * Memoized Status Component
 */
const StatusCell = memo(({ statusClass, value }) => (
  <div className={`status_Grid_point ${statusClass}`}>
    <span className="status_point"></span>
    <p className="status_text">{value}</p>
  </div>
));

StatusCell.displayName = "StatusCell";

/**
 * Stop propagation handler (reusable)
 */
const stopPropagation = (e) => e.stopPropagation();

/**
 * Format data grid - PURE FUNCTION (NO HOOKS)
 * This function is called from JSX conditionally, so it MUST NOT use hooks
 * 
 * @param {object} column - Column configuration
 * @param {object} row - Row data
 * @param {string} routeKey - Route key for navigation
 * @param {string} currentLanguage - Current language
 * @param {string} className - CSS class name
 * @param {function} navigateWithChain - Navigation function (optional)
 * @returns {JSX.Element|null} Formatted cell content
 */
export const useformatDataGrid = (
  column,
  row,
  routeKey,
  currentLanguage,
  className,
) => {
  // Early return for null values
  const value = row[column.key];
  if (value == null) return null;

  // Calculate values (NO HOOKS - just pure calculations)
  const valueRecId = column?.keyRecId ? (row[column.keyRecId] || 0) : 0;
  const configDataSelect = column?.ConfigPage;
  const routeAddEdit = configDataSelect
    ? buildRouteAddEdit(configDataSelect, valueRecId)
    : null;

  // Render logic based on column type
  switch (column.type) {
    case "date":
      return (
        <p className={className}>{useFormatDate(value, currentLanguage)}</p>

      );

    case "dateTime":
      return (
        <p className={className}>{useFormatDate(value, currentLanguage)}</p>

      );

    case "salary":
      return (
        <p className={className}>{useFormatNumber(value)}</p>
      );

    case "email":
    case "tel": {
      const href = column.type === "tel" ? `tel:${value}` : `mailto:${value}`;
      return (
        <a
          href={href}
          className={`${className} link`}
          onClick={stopPropagation}
        >
          {value}
        </a>
      );
    }

    case "status": {
      const statusClass = column.StatusList
        ? column.StatusList[row[column.secondKey]]
        : column.className || "status_Card";

      return <StatusCell statusClass={statusClass} value={value} />;
    }

    case "openPage": {
      const href = column.docViwe
        ? `${row[column.docViwe]}/${row[column.secondKey]}`
        : `${routeKey}/${row[column.secondKey]}${column.stepper ? `/${btoa(0)}` : ""}`;

      return (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={href}
          className={`${className} link font-semibold`}
          onClick={stopPropagation}
        >
          {value}
        </a>
      );
    }

    case "color":
      return <div className="status_Grid" style={{ background: value }} />;

    case "Merge":
      return (
        <p className={className}>
          {`${value} ${row[column.secondKey]}`}
        </p>
      );

    case "time":
      return (
        <p className={className}>{useFormatTime(value, currentLanguage)}</p>
      );

    default: {


      // Plain text rendering
      const displayValue = value;

      return <p className={className}>{displayValue}</p>;
    }
  }
};

