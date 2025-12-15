import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import useGetById from "../Hooks/useGetById";
import useHandleSubmit from "../Hooks/useHandleSubmit";
import CustomInput from "../Components/Form/CustomInput";
import CustomeSelect from "../Components/Form/CustomSelect/index";
import CustomeBtn from "../Components/CustomeBtn";
import useCurrencyOptions from "../Hooks/useCurrencyOptions";

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

  // if (isLoading) return "...loading";

  return (
    <div className="flex flex-col gap-16">
      <h1 className="text-2xl font-bold text-gray-800">
        {id !== "0" ? "Update vendor information" : "Create a new vendor"}
      </h1>
      <Formik
        initialValues={{
          name: data.name || "",
          vendorAccount: data.vendorAccountNumber || "",
          currencyCode: data.currencyCode || "",
        }}
        onSubmit={(values) => {
          const isEdit = id !== "0";
          const apiUrl = isEdit ? `Vendors/Update?id=${id}` : "Vendors/Add";
          setIsSubmitting(true);
          handleSubmitFormik(
            apiUrl,
            values,
            "Vendors",
            isEdit ? "edit" : "add",
            setIsSubmitting,
            setData,
            () => navigate("/vendors")
          );
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
    </div>
  );
}
