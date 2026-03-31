import { useEffect, useState, useContext } from "react";
import { IconsSortBto, IconsSortTop, IconFilter } from "../../../../assets/Icons";
import TranslationText from "../../../TranslationText";
import useTranslationText from "../../../../Hooks/useTranslationText";
import { TendersGridContext } from "../../TendersGridContext";
import ActionModal from "../../../ActionModal";
import CustomInput from "../../../Form/CustomInput";
import CustomeSelect from "../../../Form/CustomSelect";
import CustomDateRangePicker from "../../../Form/CustomDateRangePicker";
import useGetLookup from "../../../../Hooks/useGetLookup";
import useGetGenerallist from "../../../../Hooks/useGetGenerallist";
import AsyncSelectWrapper from "../../../Form/AsyncSelectWrapper";

/**
 * ColumnFilterPopover
 * -------------------
 * Extracted from ResizableColumn (Phase 7, P3 #14 — SRP).
 *
 * Renders the sort & filter dropdown for a single grid column.
 * Manages its own local filter state, fetches lookup/general-list
 * options on open, and delegates apply/clear to TendersGridContext.
 *
 * @param {object}  column       – Column definition (from DataPages/CommonGridSchemas)
 * @param {boolean} isOpen       – Whether the popover is visible
 * @param {function} onClose     – Called to close the popover
 * @param {object}  triggerRef   – React ref to the trigger element (for positioning)
 */
const ColumnFilterPopover = ({ column, isOpen, onClose, triggerRef }) => {
  const {
    ResourcePage,
    sortConfig,
    handleSortDirection,
    handleFilterGrid,
    handleClearFilter,
    valuesFilter,
    GridKey,
    currentLanguage,
  } = useContext(TendersGridContext);

  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // Use null for async-select columns (AsyncSelectWrapper expects null, not "", for empty state)
  const [filterValue, setFilterValue] = useState(
    column.filterLookup
      ? (valuesFilter?.[column.key] || null)
      : (valuesFilter?.[column.key] || "")
  );

  const { getLookup } = useGetLookup();
  const { getGenerallist } = useGetGenerallist();

  // Sync local filter value with context
  useEffect(() => {
    const raw = valuesFilter?.[column.key];
    setFilterValue(column.filterLookup ? (raw || null) : (raw || ""));
  }, [valuesFilter, column.key, column.filterLookup]);

  // Fetch options for select-type filters when opened
  useEffect(() => {
    if (isOpen && (column.generallist || column.lookupName) && dropdownOptions.length === 0) {
      setIsLoading(true);
      if (column.generallist) {
        getGenerallist(column.generallist, setIsLoading, (data) => setDropdownOptions(data));
      } else if (column.lookupName) {
        getLookup(
          column.lookupName,
          column?.keysLookup?.name || "name",
          null,
          column?.keysLookup?.recId || "recId",
          setIsLoading,
          (data) => setDropdownOptions(data),
          [],
          null,
          column.keyGetLookup !== false
        );
      } else {
        setIsLoading(false);
      }
    }
  }, [isOpen, column, dropdownOptions.length, getGenerallist, getLookup]);

  // --------------- handlers ---------------
  const handleApplyFilter = () => {
    if (filterValue !== "" && filterValue !== null) {
      handleFilterGrid({ ...valuesFilter, [column.key]: filterValue }, [column.key]);
    } else {
      const newValues = { ...valuesFilter };
      delete newValues[column.key];
      const nonEmptyFields = Object.keys(newValues).filter((k) => newValues[k] !== "" && newValues[k] !== null);

      if (nonEmptyFields.length === 0) {
        handleClearFilter();
      } else {
        handleFilterGrid(newValues, nonEmptyFields);
      }
    }
    onClose();
  };

  const handleClear = () => {
    setFilterValue("");
    const newValues = { ...valuesFilter };
    delete newValues[column.key];
    const nonEmptyFields = Object.keys(newValues).filter((k) => newValues[k] !== "" && newValues[k] !== null);

    if (nonEmptyFields.length === 0) {
      handleClearFilter();
    } else {
      handleFilterGrid(newValues, nonEmptyFields);
    }
    onClose();
  };

  const currentSort = sortConfig.find((config) => config.key === column.key);

  return (
    <ActionModal
      isOpen={isOpen}
      onClose={onClose}
      mode="dropdown"
      triggerRef={triggerRef}
      className="w-72 p-4"
      position="bottom-start"
    >
      <div className="flex flex-col gap-4">
        {/* Sorting Section */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => { handleSortDirection(column.key, "asc"); onClose(); }}
            className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border-none transition-colors ${
              currentSort?.direction === "asc"
                ? "bg-primary/10 border-primary text-primary"
                : "dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            <IconsSortTop className="w-4 h-4" />
            <span className="text-xs font-medium">
              <TranslationText title="sortAsc" page="Grid" />
            </span>
          </button>
          <button
            type="button"
            onClick={() => { handleSortDirection(column.key, "desc"); onClose(); }}
            className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border-none transition-colors ${
              currentSort?.direction === "desc"
                ? "bg-primary/10 border-primary text-primary"
                : "dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            <IconsSortBto className="w-4 h-4" />
            <span className="text-xs font-medium">
              <TranslationText title="sortDesc" page="Grid" />
            </span>
          </button>
        </div>

        {/* Filter Section */}
        {column.isFilter !== false && (
          <div className="flex flex-col gap-4 border-gray-100 dark:border-gray-700">
            {(column.filterLookup) ? (
              // Async-select: value is a raw string, onChange returns raw string
              <AsyncSelectWrapper
                key={`col_async_${column.key}`}
                lookup={column.filterLookup}
                label={column.title}
                ResourcePage={column?.ResourcePage || ResourcePage}
                value={filterValue}
                onChange={(val) => setFilterValue(val || null)}
                isClearable
                isSmall
                labelBgColor="bg-white dark:bg-bgCardDark"
              />
            ) : (column.generallist || column.lookupName || column.isFilterSelect) ? (
              <CustomeSelect
                isMulti={!!column.lookupName}
                titleGenerallist={!!column.generallist}
                value={filterValue}
                ResourcePage={column?.ResourcePage || column?.generallist}
                options={dropdownOptions}
                onChange={(e) => setFilterValue(e)}
                isLoading={isLoading}
                isClearable
                labelBgColor="bg-white dark:bg-bgCardDark"
                placeholder={
                  useTranslationText({ page: "Grid", title: "Select", lang: currentLanguage }) +
                  " " +
                  useTranslationText({ page: column.ResourcePage || ResourcePage || GridKey, title: column.title, lang: currentLanguage })
                }
                isSmall
              />
            ) : column.type === "date" || column.type === "dateTime" ? (
              <CustomDateRangePicker
                ResourcePage={column?.ResourcePage}
                value={filterValue}
                onChange={(dateRange) => setFilterValue(dateRange)}
                className="scale-90 origin-center"
              />
            ) : (
              <CustomInput
                type={column.type === "number" ? "number" : "text"}
                value={filterValue}
                autoComplete={column.key}
                onChange={(e) => setFilterValue(e.target.value)}
                placeholder={
                  useTranslationText({ page: "Grid", title: "Type", lang: currentLanguage }) +
                  " " +
                  useTranslationText({ page: column.ResourcePage || ResourcePage || GridKey, title: column.title, lang: currentLanguage })
                }
                isSmall
                labelBgColor="bg-white dark:bg-bgCardDark"
              />
            )}

            <div className="flex justify-between items-center mt-2">
              <button
                type="button"
                onClick={handleApplyFilter}
                disabled={!filterValue}
                className="px-4 py-2 text-xs font-medium text-white bg-titleColor hover:bg-opacity-90 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <TranslationText title="Apply" page="Grid" />
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 text-xs font-medium text-primary dark:text-primaryDark bg-white border border-borderColor dark:border-borderColorDark rounded-md hover:bg-gray-50 dark:bg-transparent transition-colors"
              >
                <TranslationText title="Clear" page="Grid" />
              </button>
            </div>
          </div>
        )}
      </div>
    </ActionModal>
  );
};

export default ColumnFilterPopover;
