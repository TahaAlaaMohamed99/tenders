import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import useGetById from "../Hooks/useGetById";
import useHandleSubmit from "../Hooks/useHandleSubmit";
import CustomInput from "../Components/Form/CustomInput";
import CustomeSelect from "../Components/Form/CustomSelect/index";
import CustomeBtn from "../Components/CustomeBtn";
import useCurrencyOptions from "../Hooks/useCurrencyOptions";
export default function CurrencyAddEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState({});
  const { handleSubmitFormik } = useHandleSubmit();

  const currencyOptions = useCurrencyOptions();

  const fetchData = useGetById(
    "Currencies",
    id,
    setIsLoading,
    setData,
    "/currencies",
    "Currencies"
  );

  useEffect(() => {
    if (id !== "0") fetchData();
    else setIsLoading(false);
  }, [id, fetchData]);

  // if (isLoading) return "...loading";

  return (
    <div className="flex flex-col gap-16 mt-10 px-4">
      <h1 className="text-2xl font-bold">
        {id !== "0" ? "Edit Currency" : "Add Currency"}
      </h1>
      <Formik
        initialValues={{
          currencyCode: data.currencyCode || "",
          name: data.name || "",
        }}
        onSubmit={(values) => {
          const isEdit = id !== "0";
          const apiUrl = isEdit
            ? `Currencies/Update?id=${id}`
            : "Currencies/Add";
          setIsSubmitting(true);
          handleSubmitFormik(
            apiUrl,
            values,
            "Currencies",
            isEdit ? "edit" : "add",
            setIsSubmitting,
            setData,
            () => navigate("/currencies")
          );
        }}
      >
        {({ handleChange, setFieldValue, values }) => {
          const isFormIncomplete = !values.name || !values.currencyCode;
          return (
            <Form>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <CustomInput
                  label="Name"
                  Required
                  value={values.name}
                  onChange={handleChange("name")}
                  placeholder="Enter Name"
                />
                <CustomeSelect
                  label="Currency Code"
                  options={currencyOptions}
                  value={
                    currencyOptions.find(
                      (opt) => opt.value === values.currencyCode
                    ) || null
                  }
                  onChange={(selected) =>
                    setFieldValue("currencyCode", selected?.value)
                  }
                  placeholder="Select Currency Code"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <CustomeBtn
                  type="submit"
                  title={id !== "0" ? "edit" : "save"}
                  isLoading={isSubmitting}
                  disabled={isSubmitting || isFormIncomplete}
                  className="bg-primary text-white hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  size="btn_lg"
                />
              </div>

            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
