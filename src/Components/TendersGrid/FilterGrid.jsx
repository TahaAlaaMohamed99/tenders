import { Formik, Form } from "formik";
import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
  useMemo,
} from "react";
import CustomInput from "../Form/CustomInput";
import CustomDateRangePicker from "../Form/CustomDateRangePicker";
import PopupModalSlide from "../PopupModalSlide";
import { IconFilter } from "../../assets/Icons";
import CustomeSelect from "../Form/CustomSelect";
import { setLocalStorageBtoa } from "../../utils/localStorage";
import useGetLookup from "../../Hooks/useGetLookup";
import useGetGenerallist from "../../Hooks/useGetGenerallist";
import { TendersGridContext } from "./TendersGridContext";
import { componentRegistry } from "../../ConfigData/componentRegistry";
import AsyncSelectWrapper from "../Form/AsyncSelectWrapper";

/**
 * FilterGrid
 *
 * Advanced filter drawer for the grid.
 * Renders all filterable columns automatically, and upgrades specific columns
 * using `filterSchema.overrides` (async-select, generallist-select, dependent lookups).
 */
export default function FilterGrid({ isVisible, setIsVisible }) {
  const formikRef = useRef();
  const {
    columnState,
    GridKey,
    ResourcePage,
    valuesFilter,
    handleFilterGrid,
    handleClearFilter,
    filterSchema, // { overrides: { [columnKey]: fieldDef } }
  } = useContext(TendersGridContext);

  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [dropdownLists, setDropdownLists] = useState({});

  const { getLookup } = useGetLookup();
  const { getGenerallist } = useGetGenerallist();

  // All filterable columns (respects isFilter flag)
  const FilterColumns = useMemo(
    () => columnState.all.filter((col) => col.isFilter !== false && !col.hidden),
    [columnState.all]
  );

  // Overrides map: { [columnKey]: fieldDefinition }
  const overrides = filterSchema?.overrides || {};

  // Fetch static dropdown options for non-overridden columns AND select-type overrides (generallist)
  const fetchDropdownOptions = useCallback(() => {
    if (hasLoaded) return;
    setIsLoading(true);

    // 1. Standard columns (not overridden)
    FilterColumns.forEach((column) => {
      if (overrides[column.key]) return; // skip — will be handled below or fetches its own

      if (column.generallist && !dropdownLists[column.generallist]?.length) {
        getGenerallist(column.generallist, setIsLoading, (data) =>
          setDropdownLists((prev) => ({ ...prev, [column.generallist]: data }))
        );
      }

      if (column.lookupName && !dropdownLists[column.lookupName]?.length) {
        getLookup(
          column.lookupName,
          column?.keysLookup?.name || "name",
          null,
          column?.keysLookup?.recId || "recId",
          setIsLoading,
          (data) => setDropdownLists((prev) => ({ ...prev, [column.lookupName]: data })),
          [],
          null,
          column.keyGetLookup !== false
        );
      }
    });

    // 2. Select-type overrides with generallist (e.g. vendorPartyType)
    Object.values(overrides).forEach((override) => {
      if (override.type === "select" && override.generallist && !dropdownLists[override.generallist]?.length) {
        getGenerallist(override.generallist, setIsLoading, (data) =>
          setDropdownLists((prev) => ({ ...prev, [override.generallist]: data }))
        );
      }
    });

    setHasLoaded(true);
    setIsLoading(false);
  }, [FilterColumns, hasLoaded, dropdownLists, overrides, getGenerallist, getLookup]);

  useEffect(() => {
    if (isVisible && !hasLoaded) {
      fetchDropdownOptions();
    }
  }, [isVisible, hasLoaded, fetchDropdownOptions]);

  const handleSubmitFilter = (values) => {
    const nonEmptyFields = Object.keys(values).filter(
      (key) => values[key] !== "" && values[key] != null
    );
    setLocalStorageBtoa(`TendersGrid_Filters_${GridKey}`, values);
    if (nonEmptyFields.length === 0) {
      handleClearFilter();
    } else {
      handleFilterGrid(values, nonEmptyFields);
    }
    setIsVisible(false);
  };

  return (
    <>
      <PopupModalSlide
        modalSize="w-[500px] max-w-[90vw]"
        isVisible={isVisible}
        toggleClick={() => setIsVisible(false)}
        submitClick={() => formikRef.current?.handleSubmit()}
        isLoading={isLoading}
        title="filter"
        icon={<IconFilter />}
        ResourcePage="Grid"
        ResourceBtns="Grid"
        titleSubmitBtn="applyFilters"
        titleCancel="clearFilter"
        CancelClick={() => {
          formikRef.current?.resetForm();
          setIsVisible(false);
          localStorage.removeItem(`TendersGrid_Filters_${GridKey}`);
          handleClearFilter();
        }}
      >
        <Formik
          innerRef={formikRef}
          initialValues={valuesFilter || {}}
          enableReinitialize={true}
          onSubmit={(values) => handleSubmitFilter(values)}
        >
          {({ handleSubmit, handleChange, setFieldValue, values = {} }) => {

            /**
             * Render a single filterable column as one of four variants:
             *
             *  (a) Upgraded async-select / generallist-select  ← filterSchema.overrides
             *  (b) Date range picker                           ← date / dateTime columns
             *  (c) Pre-fetched select                          ← lookupName / generallist / status
             *  (d) Plain text / number input                   ← default
             */
            const renderColumn = (column) => {
              const override = overrides[column.key];

              // ── (a) Override: upgraded via filterSchema.overrides ─────────
              if (override) {
                const Component = componentRegistry[override.type];
                if (!Component) return null;

                const handleOverrideChange = (val) => {
                  setFieldValue(override.name, val);
                  // Auto-clear any fields that declare dependsOn this field
                  Object.values(overrides).forEach((dep) => {
                    if (dep.dependsOn === override.name) {
                      setFieldValue(dep.name, null);
                    }
                  });
                };

                const isDisabled =
                  typeof override.isDisabled === "function"
                    ? override.isDisabled(values)
                    : !!override.isDisabled;

                // Resolve options depending on override type:
                //   - async-select: starts empty (AsyncSelectWrapper fetches) but applies filterOptionsBy for dependent lookup
                //   - select + generallist: pull pre-fetched list from dropdownLists
                let options = override.options || [];

                if (override.type === "select" && override.generallist) {
                  options = dropdownLists[override.generallist] || [];
                } else if (typeof override.filterOptionsBy === "function") {
                  options = override.filterOptionsBy(options, values);
                }

                return (
                  <Component
                    key={`filter_override_${column.key}`}
                    {...override}
                    options={options}
                    value={values[column.key] ?? null}
                    onChange={handleOverrideChange}
                    ResourcePage={override.ResourcePage || ResourcePage}
                    isDisabled={isDisabled}
                    formValues={values}
                    isClearable
                    labelBgColor="bg-white dark:bg-bgWhiteDark"
                  />
                );
              }

              // ── (b) filterLookup: async-select from API (columns not in schema overrides) ──
              if (column.filterLookup) {
                return (
                  <AsyncSelectWrapper
                    key={`filter_lookup_${column.key}`}
                    lookup={column.filterLookup}
                    label={column.title}
                    name={column.key}
                    ResourcePage={column?.ResourcePage || ResourcePage}
                    value={values[column.key] ?? null}
                    onChange={(val) => setFieldValue(column.key, val)}
                    formValues={values}
                    isClearable
                    labelBgColor="bg-white dark:bg-bgWhiteDark"
                  />
                );
              }

              // ── (c) Date range picker ─────────────────────────────────────
              if (column.type === "date" || column.type === "dateTime") {
                return (
                  <CustomDateRangePicker
                    key={column.key}
                    label={column.title}
                    ResourcePage={column?.ResourcePage || ResourcePage}
                    value={values?.[column.key]}
                    onChange={(dateRange) => setFieldValue(column.key, dateRange)}
                  />
                );
              }

              // ── (c) Pre-fetched select (lookupName / generallist / status) ──
              if (
                column.isFilterSelect ||
                column.lookupName ||
                column.generallist ||
                column.type === "status"
              ) {
                return (
                  <CustomeSelect
                    key={`filter_select_${column.key}`}
                    label={column.title}
                    isMulti={!!column.lookupName}
                    titleGenerallist={!!column.generallist}
                    value={values?.[column.key] || (column.lookupName ? [] : null)}
                    ResourcePage={column?.ResourcePage || ResourcePage}
                    options={dropdownLists[column.generallist || column.lookupName] || []}
                    onChange={(e) => setFieldValue(column.key, e)}
                    isClearable
                    labelBgColor="bg-white dark:bg-bgWhiteDark"
                  />
                );
              }

              // ── (d) Plain text / number input ─────────────────────────────
              return (
                <CustomInput
                  key={`filter_input_${column.key}`}
                  label={column.title}
                  autoComplete={column.key}
                  ResourcePage={column?.ResourcePage || ResourcePage}
                  name={column.key}
                  isNumber={column.type === "number"}
                  type={column.type === "percent" ? "percent" : "text"}
                  value={values?.[column.key] || ""}
                  onChange={handleChange(column.key)}
                  labelBgColor="bg-white dark:bg-bgWhiteDark"
                />
              );
            };

            return (
              <Form
                autoComplete="on"
                noValidate="noValidate"
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 p-4"
              >
                {FilterColumns.map((column) => {
                  if (!column?.key) return null;
                  return renderColumn(column);
                })}
              </Form>
            );
          }}
        </Formik>
      </PopupModalSlide>
    </>
  );
}
