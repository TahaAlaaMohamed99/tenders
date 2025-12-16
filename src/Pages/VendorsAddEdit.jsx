import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import useGetById from "../Hooks/useGetById";
import useHandleSubmit from "../Hooks/useHandleSubmit";
import CustomInput from "../Components/Form/CustomInput";
import CustomeSelect from "../Components/Form/CustomSelect/index";
import CustomeBtn from "../Components/CustomeBtn";
import useCurrencyOptions from "../Hooks/useCurrencyOptions";
import Loading from "../Components/loader";
import { IconClose } from "../assets/Icons/IconsSvg"; 
export default function VendorsAddEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState({});
  const { handleSubmitFormik } = useHandleSubmit();

  const fetchData = useGetById(
    "Vendors",
    id,
    setIsLoading,
    setData,
    "/vendors",
    "Vendors"
  );

  useEffect(() => {
    if (id !== "0") fetchData();
    else setIsLoading(false);
  }, [id, fetchData]);



  return (
    <div className="flex flex-col gap-16">
      <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-800">
        {id !== "0" ? "Update vendor information" : "Create a new vendor"}
        </h1>
        <button
          onClick={() => navigate("/vendors")}
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
          name: data.name || "",
          vendorAccount: data.vendorAccountNumber || "",
          currencyCode: data.currencyCode || "",
        }}
        enableReinitialize
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
          const isFormIncomplete =
            !values.name || !values.vendorAccount || !values.currencyCode;
          return (
            <Form  >
              <div className="grid grid-cols-2 gap-4 mb-8">
                <CustomInput
                  label="Name"
                  Required
                  value={values.name}
                  onChange={handleChange("name")}
                  placeholder="Enter Name"
                />
                <CustomInput
                  label="Vendor Account Number"
                  Required
                  value={values.vendorAccount}
                  onChange={handleChange("vendorAccount")}
                  placeholder="Enter Vendor Account Number"
                />
                <CustomeSelect
                  label="Currency"
                  options={useCurrencyOptions()}
                  value={values.currencyCode}
                  onChange={(value) => setFieldValue("currencyCode", value)}
                  placeholder="Select Currency"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">

                <CustomeBtn
                  type="submit"
                  title={id !== "0" ? "edit" : "save"}
                   isLoading={isSubmitting}
                  disabled={isSubmitting || isFormIncomplete}
                  className="bg-primary text-white hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  size="btn_lg "
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
