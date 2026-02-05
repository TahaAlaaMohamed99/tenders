import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderPageAddEdit from '../Components/HeaderPageAddEdit';
import useHandleSubmit from '../Hooks/useHandleSubmit';
import useGetById from '../Hooks/useGetById';
import useLayout from '../Hooks/useLayout';
import Loading from '../Components/loader';
import { Form, Formik } from 'formik';
import CustomInput from '../Components/Form/CustomInput';
import CustomDatePicker from '../Components/Form/CustomDatePicker';
import useGetGenerallist from '../Hooks/useGetGenerallist';
import CustomTextarea from '../Components/Form/CustomTextarea';
import useGetSelected from '../Hooks/useGetSelected';
import AsyncSelectWrapper from '../Components/Form/AsyncSelectWrapper';
import GenericGridPageLine from '../Components/GenericGridPageLine';
import { DataPagesLine } from '../ConfigData/DataPagesLine';




export const SubmissionDocumentLineAddEdit = ({ DataPage, ResourcePage, ...props }) => {
    useLayout(ResourcePage);
    const { id } = useParams();
    const navigate = useNavigate();
    const { getGenerallist } = useGetGenerallist();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [data, setData] = useState({});
    const [unit, setUnit] = useState("");
    const formRef = React.useRef();
    const { handleSubmitFormik } = useHandleSubmit();
    const fetchData = useGetById(
        DataPage.Api,
        id,
        setIsLoading,
        setData,
        null,
        ResourcePage
    );
    useEffect(() => {
        if (id && id !== "0") {
            fetchData();
        } else {
            setIsLoading(false);
        }
    }, [id, DataPage.Api]);
    const handleSave = async (values) => {
        const currentPath = window.location.pathname;
        const basePath = currentPath.split('/').slice(0, -2).join('/'); // Naive back path
        const sendData = {
            parentRecId: values.parentRecId,
            purchaceQuantity: values.purchaceQuantity,
            itemRecId: values.itemRecId,
            departmentRecId: values.departmentRecId,
        }
        await handleSubmitFormik({
            apiPage: DataPage.Api,
            values: sendData,
            recId: id,
            resourcePage: ResourcePage,
            setIsLoadingSubmit: setIsSubmitting,
            setData: setData,
            onSuccess: () => navigate(basePath),
            fetchData: fetchData
        });
    };
    const handleBack = () => {
        navigate(-1);
    };
    if (isLoading) return <Loading />;
    const isEdit = id && id !== "0";
    return (
        <>
            <div className='flex flex-col bg-bgColor dark:bg-bgColorDark'>
                <HeaderPageAddEdit
                    option={isEdit ? "edit" : "add"}
                    id={id}
                    apiKey={DataPage.Api}
                    ResourcePage={ResourcePage}
                    titleAdd={`${ResourcePage} Info`}
                    titleEdit={`${ResourcePage} Info`}
                    goBackPrev={handleBack}
                    onSubmit={() => {
                        if (formRef.current) {
                            formRef.current.submitForm();
                        }
                    }}
                    isLoadingSubmit={isSubmitting}
                    showBookmark={false}
                    viewOnly={false}
                />
                <div className="px-4 py-6">
                    <Formik
                        innerRef={formRef}
                        enableReinitialize={true}
                        initialValues={{
                            parentRecId: data.parentRecId || "",
                            purchaceQuantity: data.purchaceQuantity || "",
                            itemRecId: data.itemRecId || "",
                            departmentRecId: data.departmentRecId || "",
                        }}
                        onSubmit={(values) =>
                            handleSave(values)
                        }
                    >
                        {({
                            handleSubmit,
                            handleChange,
                            handleBlur,
                            setFieldValue,
                            values,
                            errors,
                            touched,
                            setValues,
                        }) => (
                            <Form
                                autoComplete="off"
                                noValidate="noValidate"
                                onSubmit={handleSubmit}
                                className='grid grid-cols-2 gap-x-6 gap-y-6'
                            >
                                <AsyncSelectWrapper
                                    name="itemRecId"
                                    label="Item"
                                    required
                                    value={values.itemRecId}
                                    onChange={(val) => setFieldValue('itemRecId', val)}
                                    lookup={{
                                        api: 'Item/GetLookup',
                                        valueKey: 'recId',
                                        labelKey: 'itemNumber'
                                    }}
                                    onSelectionChange={(selected) => {
                                        setUnit(selected?.original?.inventoryUnitSymbol || "UNKNOWN");
                                    }}
                                    error={errors.itemRecId}
                                    touched={touched.itemRecId}
                                />
                                <CustomInput
                                    name="unit"
                                    label="Unit"
                                    value={unit}
                                    readOnly={true}
                                    disabled={true}
                                />
                                <CustomInput
                                    name="purchaceQuantity"
                                    label="Purchace Quantity"
                                    type="number"
                                    value={values.purchaceQuantity}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={errors.purchaceQuantity}
                                    touched={touched.purchaceQuantity}
                                    required
                                />
                                <AsyncSelectWrapper
                                    name="departmentRecId"
                                    label="Department"
                                    required
                                    value={values.departmentRecId}
                                    onChange={(val) => setFieldValue('departmentRecId', val)}
                                    lookup={{
                                        api: 'Department/GetLookup',
                                        valueKey: 'operatingUnitNumber',
                                        labelKey: 'name'
                                    }}
                                    error={errors.departmentRecId}
                                    touched={touched.departmentRecId}
                                />
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    );
};