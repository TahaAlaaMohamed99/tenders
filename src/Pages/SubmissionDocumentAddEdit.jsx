import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderPageAddEdit from '../Components/HeaderPageAddEdit';
import useHandleSubmit from '../Hooks/useHandleSubmit';
import useGetById from '../Hooks/useGetById';
import useLayout from '../Hooks/useLayout';
import Loading from '../Components/loader';
import useHandleDelete from '../Hooks/useHandleDelete';
import { name } from 'dayjs/locale/ar';
import { Form, Formik } from 'formik';
import CustomInput from '../Components/Form/CustomInput';
import CustomDatePicker from '../Components/Form/CustomDatePicker';
import useGetGenerallist from '../Hooks/useGetGenerallist';
import CustomeSelect from '../Components/Form/CustomSelect';
import CustomTextarea from '../Components/Form/CustomTextarea';
import useGetSelected from '../Hooks/useGetSelected';
import GenericGridPage from '../Components/GenericGridPage';
import { DataPagesLine } from '../ConfigData/DataPagesLine';
import  SubmissionDocumentLineAddEdit  from './SubmissionDocumentLineAddEdit';
import ConfirmationModal from '../Components/ConfirmationModal';
import { IconTrash } from '../assets/Icons';

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
    const [refreshKey, setRefreshKey] = useState(0);
    const [selectedLines, setSelectedLines] = useState([]);
    const [showModalDeleteLine, setShowModalDeleteLine] = useState(false);

    const [data, setData] = useState({});

    // Ref to access DynamicForm's submit method
    const formRef = React.useRef();

    const { handleSubmitFormik } = useHandleSubmit();
    const { handleDeleteBatch } = useHandleDelete();

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



    const handleDeleteLines = () => {
        setShowModalDeleteLine(true);
    };

    const confirmDeleteLines = async () => {
        await handleDeleteBatch({
            apiPage: DataPagesLine.SubmissionDocumentLine.Api,
            ids: selectedLines.map(line => line.recId),
            resourcePage: ResourcePage,
            onSuccess: () => {
                setRefreshKey(prev => prev + 1);
                setSelectedLines([]);
                setShowModalDeleteLine(false);
            }
        });
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
    const status = data?.status || 1; // Default to 1 (New) if missing
    const isReadOnly = isEdit && status !== 1;

    return (
        <>
            <div className='flex flex-col bg-bgColor dark:bg-bgColorDark'>
                <HeaderPageAddEdit
                    option={isEdit ? "edit" : "add"}
                    id={id}
                    apiKey={DataPage.Api}
                    confiPage={DataPage}
                    ResourcePage={ResourcePage}
                    titleAdd={DataPage?.titleAdd || "add"}
                    titleEdit={DataPage?.titleEdit || "edit"}
                    goBackPrev={handleBack}
                    onSubmit={() => {
                        if (formRef.current) {
                            formRef.current.submitForm();
                        }
                    }}
                    isLoadingSubmit={isSubmitting}
                    fetchData={fetchData}
                    setData={ setData }
                    data={data}
                    showBookmark={ false }
                    viewOnly={isReadOnly}
                    statusId={status}
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
                                <fieldset disabled={isReadOnly} className="contents">
                                <CustomInput
                                    label="name"
                                    type="text"
                                    placeholder="enterName"
                                    ResourcePage={ResourcePage}
                                    value={values.name}
                                    onChange={handleChange("name")}
                                    onBlur={handleBlur("name")}
                                    name="name_Thender"
                                    // trargetId="name"
                                    errors={errors.name}
                                    touched={touched.name}
                                    required
                                    disabled={isReadOnly}
                                />
                                <CustomeSelect
                                    label="biddingType"
                                    options={biddingTypeList}
                                    Required={true}
                                    ResourcePage={ResourcePage}
                                    onChange={(e) => {
                                        setFieldValue("biddingType", e);

                                    }}
                                    value={values?.biddingType}
                                    placeholder="selectBiddingType"
                                    errors={errors.biddingType}
                                    touched={touched.biddingType}
                                    onBlur={handleBlur("biddingType")}
                                    disabled={isReadOnly}
                                />
                                <CustomDatePicker
                                    label="transDate"
                                    className="cw_p"
                                    ResourcePage={ResourcePage}
                                    Required={true}
                                    onChange={(date) => {
                                        setFieldValue("transDate", date);
                                    }}
                                    value={values.transDate}
                                    // trargetId="transDate"
                                    disabled={isReadOnly}
                                />

                                <CustomDatePicker
                                    label="executionDate"
                                    className="cw_p"
                                    ResourcePage={ResourcePage}
                                    Required={true}
                                    onChange={(date) => setFieldValue("executionDate", date)}
                                    value={values.executionDate}
                                    // trargetId="executionDate"
                                    disabled={isReadOnly}
                                />

                                <CustomTextarea
                                    label="description"
                                    type="text"
                                    placeholder="enterDescription"
                                    ResourcePage={ResourcePage}
                                    value={values.description}
                                    onChange={handleChange("description")}
                                    onBlur={handleBlur("description")}
                                    name="description_Thender"
                                    // trargetId="description"
                                    disabled={isReadOnly}
                                />
                                </fieldset>
                            </Form>
                        )}
                    </Formik>
                    <div className='mt-10'>
                        {/* Phase 1: GenericGridPageLine merged into GenericGridPage with apiOverride */}
                        <GenericGridPage
                            apiOverride={`SubmissionDocumentLine/GetAlLinesByPerantId?parentId=${id}`}
                            isGetAll={false}
                            DataPage={DataPagesLine.SubmissionDocumentLine}
                            ResourcePage={ResourcePage}
                            refreshKey={refreshKey}
                            onClickRow={(row) => {
                                setShowmodalLine(true);
                                setRecIdLine(row ? row.recId : 0);
                            }}
                            handleDelete={!isReadOnly ? handleDeleteLines : null}
                            setselectesRowInsert={setSelectedLines}
                            isReadOnly={isReadOnly}
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
                parentRecId={id}
                recId={recIdLine}
                ResourcePage={ResourcePage}
                ApiPage={DataPagesLine.SubmissionDocumentLine.Api}
                fetchGridData={() => setRefreshKey(prev => prev + 1)}
                title={(recIdLine > 0 ? "edit" : "add") + "SubmissionDocument"}
                titleSubmitBtn="save"
                isReadOnly={isReadOnly}
            />
            <ConfirmationModal
                isVisible={showModalDeleteLine}
                ResourcePage={ResourcePage}
                type={"delete"}
                title={"messageRemove"}
                description="confirmRemove"
                icon={<IconTrash />}
                confirmButtonLabel="delete"
                onConfirm={confirmDeleteLines}
                onCancel={() => {
                    setShowModalDeleteLine(false);
                }}
            />
        </>

    );
};

export default SubmissionDocumentAddEdit;
