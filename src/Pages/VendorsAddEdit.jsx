import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import useGetById from "../Hooks/useGetById";
import useGridData from "../Hooks/useGridData";
import useHandleSubmit from "../Hooks/useHandleSubmit";
import CustomInput from "../Components/Form/CustomInput";
import CustomeSelect from "../Components/Form/CustomSelect/index";
import CustomeBtn from "../Components/CustomeBtn";
import Loading from "../Components/loader";
import { IconClose } from "../assets/Icons/IconsSvg"; 
export default function VendorsAddEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [venderGroups, setVendorGroups] = useState([]);
  const [dataArea, setDataArea] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [data, setData] = useState({});
  const { handleSubmitFormik } = useHandleSubmit();
  const { fetchGridData: fetchVenderGroups } = useGridData(
    "VendorGroups/GetLookup",
    setVendorGroups,
    setIsLoading
  );
  const { fetchGridData: fetchCurrencies } = useGridData(
    "Currencies/GetLookup",
    setCurrencies,
    setIsLoading
  );
  const { fetchGridData: fetchDataArea } = useGridData(
    "Vendors/GetdataArea",
    setDataArea,
    setIsLoading
  );

  const fetchData = useGetById(
    "Vendors",
    id,
    setIsLoading,
    setData,
    "/vendors",
    "Vendors"
  );

  const getFilteredVendorGroups = ( groups, dataAreaId ) =>
    dataAreaId
      ? groups
          .filter((vg) => vg.dataAreaId.toLowerCase() === dataAreaId.toLowerCase())
          .map((vg) => ({ value: vg.vendorGroupId, label: vg.vendorGroupId }))
      : [];

  const currenciesOptions = Array.isArray(currencies)
    ? currencies.map((cc) => ({
        value: cc.currencyCode,
        label: `${cc.currencyCode} - ${cc.name}`,
      }))
    : [];
  const dataAreaOptions = Array.isArray(dataArea)
    ? dataArea.map((da) => ({
        value: da.legalEntityId.toLowerCase(),
        label: da.name,
      }))
    : [];
  useEffect(() => {
    fetchVenderGroups();
    fetchCurrencies();
    fetchDataArea();
    if (id !== "0") fetchData();
    else setIsLoading(false);
  }, [id]);



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
            vendorGroupId: data.vendorGroupId || "",
            dataAreaId: data?.dataAreaId || "",
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
            const filteredVendorOptions = getFilteredVendorGroups(
              venderGroups,
              values.dataAreaId
            );

            const isFormIncomplete =
              !values.name ||
              !values.vendorGroupId ||
              !values.currencyCode ||
              !values.dataAreaId;
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
                    label="Data Area ID"
                    options={dataAreaOptions}
                    value={
                      dataAreaOptions.find(
                        (opt) => opt.value === values.dataAreaId
                      ) || null
                    }
                    onChange={(selected) =>{
                      setFieldValue("dataAreaId", selected?.value)
                      setFieldValue("vendorGroupId", "");
                    }}
                    Required
                    placeholder="Select Data Area Code"
                  />
                  <CustomeSelect
                    label="Vendor Group ID"
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
                        ? "Select Vendor Group"
                        : "Select Data Area first"
                    }
                    isDisabled={!values.dataAreaId}
                  />

                  <CustomeSelect
                    label="currency Code ID"
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
                    placeholder="Select Data Area Code"
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
