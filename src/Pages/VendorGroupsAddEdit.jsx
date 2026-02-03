/**
 * @fileoverview Vendor Groups Add/Edit Page
 * 
 * Same SOLID pattern as VendorsAddEdit:
 * - HeaderPageAddEdit for actions
 * - Formik for form state
 * - Custom components with translation
 * 
 * @module Pages/VendorGroupsAddEdit
 */

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";

// Hooks
import useGetById from "../Hooks/useGetById";
import useGridData from "../Hooks/useGridData";
import useHandleSubmit from "../Hooks/useHandleSubmit";
import useDeviceType from "../Hooks/useDeviceType";
import useRouteMemory from "../Hooks/useRouteMemory";
import { setBreadcrumbs, clearBreadcrumbs } from "../store/Reducers/Layout/breadcrumbsSlice";

// Components
import HeaderPageAddEdit from "../Components/HeaderPageAddEdit";
import CustomInput from "../Components/Form/CustomInput";
import CustomeSelect from "../Components/Form/CustomSelect";
import Loading from "../Components/loader";

/**
 * VendorGroupsAddEdit Component
 * 
 * Handles Add/Edit for Vendor Group records.
 * Simpler than VendorsAddEdit - no cascade selects.
 * 
 * @returns {JSX.Element} The rendered page
 */
export default function VendorGroupsAddEdit() {
  // =============================================
  // ROUTING
  // =============================================
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const deviceType = useDeviceType();
  const { goBack } = useRouteMemory("setup");
  
  /** @type {React.RefObject<import('formik').FormikProps>} */
  const formikRef = useRef(null);

  // =============================================
  // STATE
  // =============================================
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dataArea, setDataArea] = useState([]);
  const [data, setData] = useState({});
  
  // =============================================
  // HOOKS
  // =============================================
  const { handleSubmitFormik } = useHandleSubmit();

  /**
   * Fetch data areas for dropdown
   */
  const { fetchGridData: fetchDataArea } = useGridData(
    "Vendors/GetdataArea",
    setDataArea,
    setIsLoading
  );
  
  /**
   * Fetch single record by ID (edit mode)
   */
  const fetchData = useGetById(
    "VendorGroups",
    id,
    setIsLoading,
    setData,
    "/vendor-groups",
    "VendorGroups"
  );

  // =============================================
  // LOOKUP TRANSFORMATIONS
  // =============================================
  const dataAreaOptions = Array.isArray(dataArea)
    ? dataArea.map((vg) => ({
        value: vg.legalEntityId,
        label: vg.name,
      }))
    : [];

  // =============================================
  // EFFECTS
  // =============================================
  useEffect(() => {
    fetchDataArea();
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
      moduleLink: "/Setup/VendorGroups",
      pageTitle: id === "0" ? "addVendorGroup" : "editVendorGroup"
    }));
    return () => dispatch(clearBreadcrumbs());
  }, [id, dispatch]);

  // =============================================
  // RENDER
  // =============================================
  return (
    <div className="flex flex-col">
      {/* Header with actions */}
      <HeaderPageAddEdit
        option={id !== "0" ? "edit" : "add"}
        id={Number(id)}
        ResourcePage="VendorGroups"
        titleAdd="addVendorGroup"
        titleEdit="editVendorGroup"
        apiKey="VendorGroups"
        onSubmit={() => formikRef.current?.submitForm()}
        isLoadingSubmit={isSubmitting}
        data={data}
        setData={setData}
        goBackPrev={() => goBack("/Setup/VendorGroups")}
        isDelete={id !== "0"}
      />

      {/* Form Content */}
      <div className={`${deviceType === "mobile" ? "p-2" : "p-4 md:p-6"}`}>
        {isLoading ? (
          <Loading />
        ) : (
          <Formik
            innerRef={formikRef}
            initialValues={{
              vendorGroupId: data.vendorGroupId || "",
              dataAreaId: data.dataAreaId || "",
              description: data.description || "",
            }}
            enableReinitialize
            onSubmit={async (values) => {
              await handleSubmitFormik({
                apiPage: "VendorGroups",
                values,
                recId: id,
                resourcePage: "VendorGroups",
                setIsLoadingSubmit: setIsSubmitting,
                setData,
                navigateTo: "/vendor-groups",
                fetchData,
              });
            }}
          >
            {({ handleChange, setFieldValue, values }) => {
              // Form validation check
              const isFormIncomplete =
                !values.vendorGroupId ||
                !values.dataAreaId ||
                !values.description;

              return (
                <Form>
                  {/* Section Title */}
                  <h3 className="text-base font-semibold text-titleColor dark:text-titleColorDark mb-4">
                    Vendor Group Info
                  </h3>
                  
                  {/* Form Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Data Area Select */}
                    <CustomeSelect
                      label="dataAreaId"
                      ResourcePage="VendorGroups"
                      options={dataAreaOptions}
                      value={
                        dataAreaOptions.find(
                          (opt) => opt.value.toLowerCase() === values.dataAreaId.toLowerCase()
                        ) || null
                      }
                      onChange={(selected) =>
                        setFieldValue("dataAreaId", selected?.value)
                      }
                      Required
                      placeholder="selectDataArea"
                    />
                    
                    {/* Vendor Group ID */}
                    <CustomInput
                      label="vendorGroupId"
                      ResourcePage="VendorGroups"
                      value={values.vendorGroupId}
                      onChange={handleChange("vendorGroupId")}
                      Required
                      placeholder="enterVendorGroupId"
                    />

                    {/* Description - Full width */}
                    <div className="md:col-span-2">
                      <CustomInput
                        label="description"
                        ResourcePage="VendorGroups"
                        Required
                        value={values.description}
                        onChange={handleChange("description")}
                        placeholder="enterDescription"
                      />
                    </div>
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
