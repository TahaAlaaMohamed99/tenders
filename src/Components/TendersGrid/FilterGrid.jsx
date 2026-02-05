import { Formik, Form } from "formik";
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from "react";
import CustomInput from "../Form/CustomInput";
import CustomDateRangePicker from "../Form/CustomDateRangePicker";
import PopupModalSlide from "../PopupModalSlide";
import { IconFilter } from "../../assets/Icons";
import CustomeSelect from "../Form/CustomSelect";
import { setLocalStorageBtoa } from "../../utils/useFromLocalStorage";
import useGetLookup from "../../Hooks/useGetLookup";
import useGetGenerallist from "../../Hooks/useGetGenerallist";
import { TendersGridContext } from "./TendersGridContext";
  

export default function FilterGrid({ isVisible, setIsVisible }) {
  const formikRef = useRef();
  const {
    columnState,
    GridKey,
    ResourcePage, // Destructure ResourcePage
    valuesFilter,
    handleFilterGrid,
    handleClearFilter,
  } = useContext(TendersGridContext);

  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const [dropdownLists, setDropdownLists] = useState(() => {
    const initialLists = {};
    columnState.all.forEach((column) => {
      if (column.generallist || column.lookupName) {
        initialLists[column.generallist || column.lookupName] = [];
      }
    });
    return initialLists;
  });
  const { getLookupFilterGrid } = useGetLookup();
  const { getGenerallist } = useGetGenerallist();

  const FilterColumns = columnState.all.filter(
    (column) => column.isFilter != false && !column.hidden
  );
   const fetchDropdownOptions = useCallback(() => {
    if (hasLoaded) return;

    setIsLoading(true);

    FilterColumns?.forEach((column) => {
      if (column.generallist && !dropdownLists[column.generallist]?.length) {
        getGenerallist(column.generallist, setIsLoading, (data) =>
          setDropdownLists((prev) => ({
            ...prev,
            [column.generallist]: data,
          }))
        );
      }

      if (column.lookupName && !dropdownLists[column.lookupName]?.length) {
        getLookupFilterGrid(
          column.lookupName,
          column?.keysLookup?.name || "name",
          column?.keysLookup?.recId || "recId",
          (data) =>
            setDropdownLists((prev) => ({
              ...prev,
              [column.lookupName]: data,
            })),
          column.keyRecId || "recId",
          column.keyGetLookup != false ? true : false
        );
      }
    });

    setHasLoaded(true);
    setIsLoading(false);
  }, [FilterColumns, hasLoaded, dropdownLists]);

  useEffect(() => {
    if (isVisible) {
      if (!hasLoaded) {
        fetchDropdownOptions();
      }
      setHasLoaded(true);
    }
  }, [isVisible]);

  const handleSubmitFilter = (values) => {
    const nonEmptyFields = Object.keys(values).filter(
      (key) => values[key] != "" && values[key] != null
    );
    setLocalStorageBtoa(`TendersGrid_Filters_${GridKey}`, values);
    if (nonEmptyFields.length == 0) {
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
        toggleClick={() => {
          setIsVisible(false);
        }}
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
          {({ handleSubmit, handleChange, setFieldValue, values = {} }) => (
            <Form
              autoComplete="off"
              noValidate="noValidate"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 p-4"
            >
              {FilterColumns?.map((column) => {
                if (!column?.key) return null;

                // Date and DateTime types - use date range picker
                if (column.type === "date" || column.type === "dateTime") {
                  return (
                    <CustomDateRangePicker
                      key={column.key}
                      label={column.title}
                      ResourcePage={column?.ResourcePage || ResourcePage}
                      value={values?.[column.key]}
                      onChange={(dateRange) =>
                        setFieldValue(column.key, dateRange)
                      }
                    />
                  );
                }
              
                // Select dropdown for:
                // 1. Explicitly marked as filter select
                // 2. Has lookupName (for lookup data)
                // 3. Has generallist (for enum/status types)
                // 4. Status type columns (should use select even without generallist)
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
                      isMulti={column.lookupName ? true : false}
                      titleGenerallist={column.generallist ? true : false}
                      value={values?.[column.key] || (column.lookupName ? [] : null)}
                      ResourcePage={column?.ResourcePage || column?.generallist || ResourcePage}
                      options={
                        dropdownLists[
                        column.generallist || column.lookupName
                        ] || []
                      }
                      onChange={(e) => setFieldValue(column.key, e)}
                      isClearable
                    />
                  );
                }
               
                // Default: Text input (supports number, percent, text types)
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
                  />
                );
              })}
            </Form>
          )}
        </Formik>
      </PopupModalSlide>
    </>
  );
}
