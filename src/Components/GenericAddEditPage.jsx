import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DynamicForm from './DynamicForm';
import HeaderPageAddEdit from './HeaderPageAddEdit';
import useHandleSubmit from '../Hooks/useHandleSubmit';
import useGetById from '../Hooks/useGetById';
import useLayout from '../Hooks/useLayout';
import Loading from './loader';
import componentRegistry from '../ConfigData/componentRegistry';

/**
 * GenericAddEditPage
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

const GenericAddEditPage = ({ DataPage, ResourcePage, ...props }) => {
    useLayout(ResourcePage);
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
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
    }, [id, DataPage.Api]);

    const handleSave = async (values) => {
        const currentPath = window.location.pathname;
        const basePath = currentPath.split('/').slice(0, -2).join('/'); // Naive back path

        await handleSubmitFormik({
            apiPage: DataPage.Api,
            values: values,
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
        <div className='flex flex-col bg-bgColor dark:bg-bgColorDark'>
            <HeaderPageAddEdit
                option={isEdit ? "edit" : "add"}
                id={id}
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
                showBookmark={false}
                viewOnly={false}
                apiKey={DataPage.Api}
                confiPage={DataPage}
            />
            <div className="px-4 py-6">
                <DynamicForm 
                    ref={formRef}
                    DataPage={DataPage}
                    ResourcePage={ResourcePage}
                    onSave={handleSave}
                    components={componentRegistry}
                    initialData={data}
                    isEdit={isEdit}
                    id={id}
                    isSubmitting={isSubmitting}
                    onBack={handleBack}
                    onSubmit={() => {
                        if (formRef.current) {
                            formRef.current.submitForm();
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default GenericAddEditPage;
