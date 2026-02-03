/**
 * @fileoverview Vendors Add/Edit Page
 * 
 * This page demonstrates the SOLID pattern for Add/Edit pages:
 * 1. HeaderPageAddEdit - Handles all header actions (Save, Delete, Bookmark, etc.)
 * 2. Formik Form - Handles form state and validation
 * 3. Custom Components - Render individual fields with translation support
 * 
 * ## Architecture Flow
 * 
 * ```
 * User clicks Save (in Header)
 *        ↓
 * HeaderPageAddEdit.onSubmit() called
 *        ↓
 * formikRef.current.submitForm()
 *        ↓
 * Formik validates and calls onSubmit
 *        ↓
 * handleSubmitFormik() sends to API
 * ```
 * 
 * @module Pages/VendorsAddEdit
 */

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";

// =============================================
// HOOKS - Reusable logic for API operations
// =============================================
import useGetById from "../Hooks/useGetById";
import useGridData from "../Hooks/useGridData";
import useHandleSubmit from "../Hooks/useHandleSubmit";
import useDeviceType from "../Hooks/useDeviceType";
import useRouteMemory from "../Hooks/useRouteMemory";
import { setBreadcrumbs, clearBreadcrumbs } from "../store/Reducers/Layout/breadcrumbsSlice";

// =============================================
// COMPONENTS - UI building blocks
// =============================================
import HeaderPageAddEdit from "../Components/HeaderPageAddEdit";
import CustomInput from "../Components/Form/CustomInput";
import CustomeSelect from "../Components/Form/CustomSelect/index";
import Loading from "../Components/loader";

/**
 * VendorsAddEdit Component
 * 
 * Handles both Add and Edit modes for Vendor records.
 * 
 * ## Key Features
 * - Uses HeaderPageAddEdit for standardized header with actions
 * - Formik for form state management
 * - Cascading select (dataArea → vendorGroup)
 * - All labels translated via ResourcePage
 * 
 * @returns {JSX.Element} The rendered page
 * 
 * @example
 * // Route configuration:
 * <Route path="/vendors/:id" element={<VendorsAddEdit />} />
 * 
 * // Add mode: /vendors/0
 * // Edit mode: /vendors/123
 */
export default function VendorsAddEdit() {
  // =============================================
  // ROUTING - Get ID from URL params
  // =============================================
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Responsive layout detection
  const deviceType = useDeviceType();
  
  // Route memory for "Go Back" navigation
  const { goBack } = useRouteMemory("setup");
  
  /**
   * Reference to Formik instance
   * Used to trigger form submission from HeaderPageAddEdit
   * @type {React.RefObject<import('formik').FormikProps>}
   */
  const formikRef = useRef(null);

  // =============================================
  // STATE - Local component state
  // =============================================
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  /** @type {[Array, Function]} Vendor groups for dropdown */
  const [venderGroups, setVendorGroups] = useState([]);
  
  /** @type {[Array, Function]} Data areas (legal entities) */
  const [dataArea, setDataArea] = useState([]);
  
  /** @type {[Array, Function]} Currency options */
  const [currencies, setCurrencies] = useState([]);
  
  /** @type {[Object, Function]} Current record data (edit mode) */
  const [data, setData] = useState({});

  // =============================================
  // HOOKS - API operations
  // =============================================
  const { handleSubmitFormik } = useHandleSubmit();
  
  /**
   * Fetch vendor groups lookup data
   * Returns: [{ vendorGroupId, dataAreaId, description }]
   */
  const { fetchGridData: fetchVenderGroups } = useGridData(
    "VendorGroups/GetLookup",
    setVendorGroups,
    setIsLoading
  );
  
  /**
   * Fetch currencies lookup data
   * Returns: [{ currencyCode, name }]
   */
  const { fetchGridData: fetchCurrencies } = useGridData(
    "Currencies/GetLookup",
    setCurrencies,
    setIsLoading
  );
  
  /**
   * Fetch data areas (legal entities)
   * Returns: [{ legalEntityId, name }]
   */
  const { fetchGridData: fetchDataArea } = useGridData(
    "Vendors/GetdataArea",
    setDataArea,
    setIsLoading
  );

  /**
   * Fetch single vendor record by ID (edit mode)
   */
  const fetchData = useGetById(
    "Vendors",
    id,
    setIsLoading,
    setData,
    "/vendors",
    "Vendors"
  );

  // =============================================
  // LOOKUP TRANSFORMATIONS
  // =============================================
  
  /**
   * Filters vendor groups by selected data area
   * This creates the CASCADE effect:
   * When dataArea changes → only show matching vendorGroups
   * 
   * @param {Array} groups - All vendor groups
   * @param {string} dataAreaId - Selected data area ID
   * @returns {Array} Filtered options for select
   */
  const getFilteredVendorGroups = (groups, dataAreaId) =>
    dataAreaId
      ? groups
          .filter((vg) => vg.dataAreaId.toLowerCase() === dataAreaId.toLowerCase())
          .map((vg) => ({ value: vg.vendorGroupId, label: vg.vendorGroupId }))
      : [];

  /**
   * Transform currencies to select options
   * Format: "USD - US Dollar"
   */
  const currenciesOptions = Array.isArray(currencies)
    ? currencies.map((cc) => ({
        value: cc.currencyCode,
        label: `${cc.currencyCode} - ${cc.name}`,
      }))
    : [];
    
  /**
   * Transform data areas to select options
   */
  const dataAreaOptions = Array.isArray(dataArea)
    ? dataArea.map((da) => ({
        value: da.legalEntityId.toLowerCase(),
        label: da.name,
      }))
    : [];

  // =============================================
  // EFFECTS - Load data on mount
  // =============================================
  useEffect(() => {
    // Fetch all lookups in parallel
    fetchVenderGroups();
    fetchCurrencies();
    fetchDataArea();
    
    // Fetch record if edit mode (id !== "0")
    if (id !== "0") {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [id]);

  // Set breadcrumbs for navigation
  useEffect(() => {
    dispatch(setBreadcrumbs({
      companyName: "",
      ResourceModule: "Setup",
      moduleLink: "/Setup/Vendors",
      pageTitle: id === "0" ? "addVendor" : "editVendor"
    }));
    return () => dispatch(clearBreadcrumbs());
  }, [id, dispatch]);

  // =============================================
  // RENDER
  // =============================================
  return (
    <div className="flex flex-col">
      {/* =========================================
          HEADER - Actions (Save, Delete, Close)
          ========================================= */}
      <HeaderPageAddEdit
        // Mode: "add" or "edit" based on ID
        option={id !== "0" ? "edit" : "add"}
        id={Number(id)}
        
        // Translation namespace for this page
        ResourcePage="Vendors"
        
        // Title keys (translated via ResourcePage)
        titleAdd="addVendor"
        titleEdit="editVendor"
        
        // API endpoint for delete operation
        apiKey="Vendors"
        
        /**
         * Save handler - triggers Formik submit
         * This is the KEY INTEGRATION:
         * Header button → Formik submit → API call
         */
        onSubmit={() => formikRef.current?.submitForm()}
        isLoadingSubmit={isSubmitting}
        
        // Data state for internal operations
        data={data}
        setData={setData}
        
        // Navigation
        goBackPrev={() => goBack("/Setup/Vendors")}
        
        // Show delete button in edit mode
        isDelete={id !== "0"}
      />

      {/* =========================================
          FORM CONTENT
          ========================================= */}
      <div className={`${deviceType === "mobile" ? "p-2" : "p-4 md:p-6"}`}>
        {isLoading ? (
          <Loading />
        ) : (
          <Formik
            // Expose Formik instance via ref
            innerRef={formikRef}
            
            // Initial values from fetched data (edit) or empty (add)
            initialValues={{
              name: data.name || "",
              vendorGroupId: data.vendorGroupId || "",
              dataAreaId: data?.dataAreaId || "",
              currencyCode: data.currencyCode || "",
            }}
            
            // Re-initialize when data changes (after fetch)
            enableReinitialize
            
            /**
             * Form submission handler
             * Called after Formik validation passes
             */
            onSubmit={async (values) => {
              await handleSubmitFormik({
                apiPage: "Vendors",
                values,
                recId: id,
                resourcePage: "Vendors",
                setIsLoadingSubmit: setIsSubmitting,
                setData,
                navigateTo: "/vendors",
                fetchData,
              });
            }}
          >
            {({ handleChange, setFieldValue, values }) => {
              // Get filtered vendor groups based on selected dataArea
              const filteredVendorOptions = getFilteredVendorGroups(
                venderGroups,
                values.dataAreaId
              );

              return (
                <Form>
                  {/* Section Title */}
                  <h3 className="text-base font-semibold text-titleColor dark:text-titleColorDark mb-4">
                    Vendor Info
                  </h3>
                  
                  {/* Form Grid - 2 columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name Field */}
                    <CustomInput
                      label="name"
                      ResourcePage="Vendors"
                      Required
                      value={values.name}
                      onChange={handleChange("name")}
                      placeholder="enterName"
                    />
                    
                    {/* Data Area Select */}
                    <CustomeSelect
                      label="dataAreaId"
                      ResourcePage="Vendors"
                      options={dataAreaOptions}
                      value={
                        dataAreaOptions.find(
                          (opt) => opt.value === values.dataAreaId
                        ) || null
                      }
                      onChange={(selected) => {
                        setFieldValue("dataAreaId", selected?.value);
                        // CASCADE CLEAR: Reset vendorGroupId when dataArea changes
                        setFieldValue("vendorGroupId", "");
                      }}
                      Required
                      placeholder="selectDataArea"
                    />
                    
                    {/* Vendor Group Select (filtered by dataArea) */}
                    <CustomeSelect
                      label="vendorGroupId"
                      ResourcePage="Vendors"
                      options={filteredVendorOptions}
                      value={
                        filteredVendorOptions.find(
                          (opt) => opt.value === values.vendorGroupId
                        ) || null
                      }
                      onChange={(selected) =>
                        setFieldValue("vendorGroupId", selected?.value)
                      }
                      Required
                      placeholder={
                        values.dataAreaId
                          ? "selectVendorGroup"
                          : "selectDataAreaFirst"
                      }
                      isDisabled={!values.dataAreaId}
                    />

                    {/* Currency Code Select */}
                    <CustomeSelect
                      label="currencyCode"
                      ResourcePage="Vendors"
                      options={currenciesOptions}
                      value={
                        currenciesOptions.find(
                          (opt) => opt.value === values.currencyCode
                        ) || null
                      }
                      onChange={(selected) =>
                        setFieldValue("currencyCode", selected?.value)
                      }
                      Required
                      placeholder="selectCurrency"
                    />
                  </div>
                </Form>
              );
            }}
          </Formik>
        )}
      </div>
    </div>
  );
}
