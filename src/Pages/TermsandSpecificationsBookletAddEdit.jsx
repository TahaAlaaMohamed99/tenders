import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderPageAddEdit from '../Components/HeaderPageAddEdit';
import useHandleSubmit from '../Hooks/useHandleSubmit';
import useGetById from '../Hooks/useGetById';
import useLayout from '../Hooks/useLayout';
import Loading from '../Components/loader';
import useHandleDelete from '../Hooks/useHandleDelete';

import { Form, Formik } from 'formik';
import CustomInput from '../Components/Form/CustomInput';
import GenericGridPageLine from '../Components/GenericGridPageLine';
import { DataPagesLine } from '../ConfigData/DataPagesLine';
import TermsandSpecificationsBookletLineAddEdit from './TermsandSpecificationsBookletLineAddEdit';
import ConfirmationModal from '../Components/ConfirmationModal';
import { IconTrash } from '../assets/Icons';

/**
 * TermsandSpecificationsBookletAddEdit
 */

const TermsandSpecificationsBookletAddEdit = ({ DataPage, ResourcePage, ConfigPage, ...props }) => {
    const activeConfig = ConfigPage || DataPage;
    useLayout(ResourcePage, activeConfig);
    const { id } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showmodalLine, setShowmodalLine] = useState(false);
    const [recIdLine, setRecIdLine] = useState(0);
    const [refreshKey, setRefreshKey] = useState(0);
    const [selectedLines, setSelectedLines] = useState([]);
    const [showModalDeleteLine, setShowModalDeleteLine] = useState(false);

    const [data, setData] = useState({});

    // Ref to access Formik's submit method
    const formRef = useRef();

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
    }, [id, DataPage.Api]);

    const handleSave = async (values) => {
        const currentPath = window.location.pathname;
        const basePath = currentPath.split('/').slice(0, -2).join('/');
        const sendData = {
            name: values.name,
            code: values.code,
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
            apiPage: DataPagesLine.TermsandSpecificationsBookletLine.Api,
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

    if (isLoading) return <Loading />;

    const isEdit = id && id !== "0";
    const status = data?.status || 1; 
    const isReadOnly = isEdit && status !== 1;

    return (
        <>
            <div className='flex flex-col bg-bgColor dark:bg-bgColorDark'>
                <HeaderPageAddEdit
                    option={isEdit ? "edit" : "add"}
                    id={id}
                    apiKey={DataPage.Api}
                    confiPage={activeConfig}
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
                            name: data.name || "",
                            code: data.code || "",
                        }}
                        onSubmit={(values) =>
                            handleSave(values)
                        }
                    >
                        {({
                            handleSubmit,
                            handleChange,
                            handleBlur,
                            values,
                            errors,
                            touched,
                        }) => (
                            <Form
                                autoComplete="off"
                                noValidate="noValidate"
                                onSubmit={handleSubmit}
                                className='grid grid-cols-1 gap-x-6 gap-y-6'
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
                                        name="name"
                                        errors={errors.name}
                                        touched={touched.name}
                                        required
                                        disabled={isReadOnly}
                                        gridWidth="col-span-12"
                                    />
                                </fieldset>
                            </Form>
                        )}
                    </Formik>
                    <div className='mt-10'>
                        <GenericGridPageLine
                            apiOverride={`TermsandSpecificationsBookletLine/GetAlLinesByPerantId?parentId=${id}`}
                            isGetAll={false}
                            DataPage={DataPagesLine.TermsandSpecificationsBookletLine}
                            ResourcePage={ResourcePage}
                            refreshKey={refreshKey}
                            onClickRow={(row) => {
                                setShowmodalLine(true);
                                setRecIdLine(row ? row.recId : 0);
                            }}
                            handleDelete={!isReadOnly ? handleDeleteLines : null}
                            setSelectedRows={setSelectedLines}
                            isReadOnly={isReadOnly}
                            ConfigPage={activeConfig}
                        />
                    </div>
                </div>
            </div>
            <TermsandSpecificationsBookletLineAddEdit
                isVisible={showmodalLine}
                toggleClick={() => {
                    setShowmodalLine(false);
                    setRecIdLine(0);
                }}
                parentRecId={id}
                recId={recIdLine}
                ResourcePage={ResourcePage}
                ApiPage={DataPagesLine.TermsandSpecificationsBookletLine.Api}
                fetchGridData={() => setRefreshKey(prev => prev + 1)}
                title={(recIdLine > 0 ? "edit" : "add") + "TermsandSpecificationsBooklet"}
                titleSubmitBtn="save"
                isReadOnly={isReadOnly}
                ConfiMainPage={activeConfig}
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

export default TermsandSpecificationsBookletAddEdit;
