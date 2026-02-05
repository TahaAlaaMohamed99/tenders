import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderPageAddEdit from '../Components/HeaderPageAddEdit';
import useHandleSubmit from '../Hooks/useHandleSubmit';
import useGetById from '../Hooks/useGetById';
import useLayout from '../Hooks/useLayout';
import Loading from '../Components/loader';
import { name } from 'dayjs/locale/ar';
import { Form, Formik } from 'formik';
import CustomInput from '../Components/Form/CustomInput';
import CustomDatePicker from '../Components/Form/CustomDatePicker';
import useGetGenerallist from '../Hooks/useGetGenerallist';
import CustomeSelect from '../Components/Form/CustomSelect';
import CustomTextarea from '../Components/Form/CustomTextarea';
import useGetSelected from '../Hooks/useGetSelected';
import GenericGridPageLine from '../Components/GenericGridPageLine';
import { DataPagesLine } from '../ConfigData/DataPagesLine';
import  SubmissionDocumentLineAddEdit  from './SubmissionDocumentLineAddEdit';

/**
 * SubmissionDocumentAddEdit
 * 
 * A reusable "Smart Container" for Add/Edit Pages.
 * Connects configuration from DataPages to the DynamicForm component.
 * Handles:
 * - URL Parameter Parsing (:id)
 * - Data Fetching (useGetById)
 * - Form Submission (useHandleSubmit)
 * - Navigation (Back / After Save)
 * - Loading States
 * 
 * @param {Object} props
 * @param {Object} props.DataPage - The full configuration object (must contain formSchema)
 * @param {string} props.ResourcePage - The resource key for localization/API
 */

const SubmissionDocumentAddEdit = ({ DataPage, ResourcePage, ...props }) => {
    useLayout(ResourcePage);
    const { id } = useParams();
    const navigate = useNavigate();
    const { getGenerallist } = useGetGenerallist();

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [biddingTypeList, setBiddingTypeList] = useState([]);
    const [showmodalLine, setShowmodalLine] = useState(false);
    const [recIdLine, setRecIdLine] = useState(0);

    const [data, setData] = useState({});

    // Ref to access DynamicForm's submit method
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
        getGenerallist("BiddingType", setIsLoading, setBiddingTypeList);

    }, [id, DataPage.Api]);

    const handleSave = async (values) => {
        const currentPath = window.location.pathname;
        const basePath = currentPath.split('/').slice(0, -2).join('/'); // Naive back path
        const sendData = {
            description: values.description,
            name: values.name,
            transDate: values.transDate,
            executionDate: values.executionDate,
            biddingType: values.biddingType?.value,
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

    const handleDelete = () => {
        console.warn("Generic Delete not fully implemented in SubmissionDocumentAddEdit yet");
        // Implement confirm modal logic here if using Generic Delete
    };
    const handleBack = () => {
        navigate(-1);
    };

    const selectedBiddingType = useGetSelected(
        biddingTypeList,
        data?.biddingType || 1,

    );
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
                            transDate: data.transDate || new Date(),
                            executionDate: data.executionDate || new Date(),
                            name: data.name || "",
                            description: data.description || "",
                            biddingType: selectedBiddingType || null,
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
                                <CustomInput
                                    label="name"
                                    type="text"
                                    placeholder="pleaseEnterName"
                                    ResourcePage="GeneralField"
                                    value={values.name}
                                    onChange={handleChange("name")}
                                    onBlur={handleBlur("name")}
                                    name="name_Thender"
                                    // trargetId="name"
                                    errors={errors.name}
                                    touched={touched.name}
                                    required
                                />
                                <CustomeSelect
                                    label="biddingType"
                                    options={biddingTypeList}
                                    Required={true}
                                    ResourcePage="biddingType"
                                    onChange={(e) => {
                                        setFieldValue("biddingType", e);

                                    }}
                                    value={values?.biddingType}
                                    placeholder="pleaseSelectBiddingType"
                                    errors={errors.biddingType}
                                    touched={touched.biddingType}
                                    onBlur={handleBlur("biddingType")}
                                />
                                <CustomDatePicker
                                    label="transDate"
                                    className="cw_p"
                                    ResourcePage="GeneralField"
                                    Required={true}
                                    onChange={(date) => {
                                        setFieldValue("transDate", date);
                                    }}
                                    value={values.transDate}
                                    // trargetId="transDate"
                                />

                                <CustomDatePicker
                                    label="executionDate"
                                    className="cw_p"
                                    ResourcePage="GeneralField"
                                    Required={true}
                                    onChange={(date) => setFieldValue("executionDate", date)}
                                    value={values.executionDate}
                                    // trargetId="executionDate"
                                />

                                <CustomTextarea
                                    label="description"
                                    type="text"
                                    placeholder="pleaseEnterDescription"
                                    ResourcePage="GeneralField"
                                    value={values.description}
                                    onChange={handleChange("description")}
                                    onBlur={handleBlur("description")}
                                    name="description_Thender"
                                    // trargetId="description"
                                />
                            </Form>
                        )}
                    </Formik>
                    <div className='mt-10'>
                        <GenericGridPageLine
                            ApiGetAllLines={`SubmissionDocumentLine/GetAlLinesByPerantId?parentId=${id}`}
                            DataPage={DataPagesLine.SubmissionDocumentLine}
                            ResourcePage={ResourcePage}
                            onCilckRow={(row) => {
                                setShowmodalLine(true);
                                setRecIdLine(row.id);
                            }}
                        />
                    </div>

                </div>
            </div>
            <SubmissionDocumentLineAddEdit
                isVisible={showmodalLine}
                toggleClick={() => {
                    setShowmodalLine(false);
                    setRecIdLine(0);
                }}
                parentId={id}
                recId={recIdLine}
            />
        </>

    );
};

export default SubmissionDocumentAddEdit;
