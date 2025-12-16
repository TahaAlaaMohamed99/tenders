import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import useGetById from "../Hooks/useGetById";
import useHandleSubmit from "../Hooks/useHandleSubmit";
import CustomInput from "../Components/Form/CustomInput";
import CustomeBtn from "../Components/CustomeBtn";
import Loading from "../Components/loader";
import { IconClose } from "../assets/Icons/IconsSvg"; 
export default function VendorGroupsAddEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState({});
  const { handleSubmitFormik } = useHandleSubmit();

  const fetchData = useGetById(
    "VendorGroups",
    id,
    setIsLoading,
    setData,
    "/vendor-groups",
    "VendorGroups"
  );

  useEffect(() => {
    if (id !== "0") fetchData();
    else setIsLoading(false);
  }, [id, fetchData]);



  return (
    <div className="flex flex-col gap-16">
      <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-800">
        {id !== "0"
          ? "Update vendor group information"
          : "Create a new vendor group"}
      </h1>
     <button
        onClick={() => navigate("/vendor-groups")}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        title="Close"
        type="button"
      >
      <IconClose className="w-6 h-6 text-gray-600" />
      </button>
      </div>
      {isLoading ? (
        <Loading />
    ) : (
      <Formik
        initialValues={{
          vendorGroupId: data.vendorGroupId || "",
          dataAreaId: data.dataAreaId || "",
          description: data.description || "",
        }}
        enableReinitialize
        onSubmit={async(values) => {
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
        {({ handleChange, values }) => {
          const isFormIncomplete =
            !values.vendorGroupId || !values.dataAreaId || !values.description;

          return (
            <Form  >
              <div className="grid grid-cols-2 gap-4 mb-8">

                <CustomInput
                  label="Vendor Group ID"
                  Required
                  value={values.vendorGroupId}
                  onChange={handleChange("vendorGroupId")}
                  placeholder="Enter Vendor Group ID"
                />

                <CustomInput
                  label="Data Area ID"
                  Required
                  value={values.dataAreaId}
                  onChange={handleChange("dataAreaId")}
                  placeholder="Enter Data Area ID"
                />

                <CustomInput
                  label="Description"
                  Required
                  value={values.description}
                  onChange={handleChange("description")}
                  placeholder="Enter Description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <CustomeBtn
                  type="submit"
                  title={id !== "0" ? "edit" : "save"}
                  ResourcePage="General"
                  isLoading={isSubmitting}
                  disabled={isSubmitting || isFormIncomplete}
                  className="bg-primary text-white hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed  "
                  size="btn_lg"
                />
              </div>
            </Form>
          );
        }}
      </Formik>
    )}
    </div>
  );
}
