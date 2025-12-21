import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import useGetById from "../Hooks/useGetById";
import useGridData from "../Hooks/useGridData";
import useHandleSubmit from "../Hooks/useHandleSubmit";
import CustomInput from "../Components/Form/CustomInput";
import CustomeBtn from "../Components/CustomeBtn";
import CustomeSelect from "../Components/Form/CustomSelect";
import Loading from "../Components/loader";
import { IconClose } from "../assets/Icons/IconsSvg"; 
export default function VendorGroupsAddEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dataArea, setDataArea] = useState([]);
  const [data, setData] = useState({});
  const { handleSubmitFormik } = useHandleSubmit();
  // const vendorsOptions = [
  //   { value: "Test 01", label: "Test 01" },
  //   { value: "Test 02", label: "Test 02" },
  //   { value: "Test 03", label: "Test 03" },
  //   { value: "Test 04", label: "Test 04" },
  //   { value: "Test 05", label: "Test 05" },
  // ];
  // const dataAreaOptions = [
  //   { value: "Test 01", label: "Test 01" },
  //   { value: "Test 02", label: "Test 02" },
  //   { value: "Test 03", label: "Test 03" },
  //   { value: "Test 04", label: "Test 04" },
  //   { value: "Test 05", label: "Test 05" },
  // ];
  const { fetchGridData: fetchDataArea } = useGridData("Vendors/GetdataArea", setDataArea, setIsLoading);
  const fetchData = useGetById(
    "VendorGroups",
    id,
    setIsLoading,
    setData,
    "/vendor-groups",
    "VendorGroups"
  );

  const dataAreaOptions = Array.isArray(dataArea)
    ? dataArea.map((vg) => ({
        value: vg.legalEntityId,
        label: vg.name,
      }))
    : [];
  useEffect(() => {
    fetchDataArea();
    if (id !== "0") fetchData();
    else setIsLoading(false);
  }, [id]);

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
          
            const isFormIncomplete =
              !values.vendorGroupId ||
              !values.dataAreaId ||
              !values.description;

            return (
              <Form>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <CustomeSelect
                    label="Data Area ID"
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
                    placeholder="Select Data Area Code"
                  />
                  <CustomInput
                    label="Vendor Group ID"
                    value={values.vendorGroupId}
                    onChange={handleChange("vendorGroupId")}
                    Required
                    placeholder="Select Data Area Code"
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
