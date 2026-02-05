import React, { useRef, useLayoutEffect, useCallback, useState, useEffect, useMemo } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TranslationText from './TranslationText';
import useGetGenerallist from '../Hooks/useGetGenerallist';

/**
 * DynamicForm Component
 * 
 * Renders a form based on the schema and a PROVIDED component registry.
 * This allows each page to inject distinct custom components.
 * Includes integrated section headers with action buttons.
 * 
 * @param {Object} props
 * @param {Object} props.DataPage - Full page config from DataPages.jsx (contains formSchema)
 * @param {string} props.ResourcePage - Resource key for translations
 * @param {Function} props.onSave - Callback for Save button (receives form values)
 * @param {Function} props.onSubmit - Callback to trigger form submission
 * @param {Function} props.onBack - Callback for Back/Return button
 * @param {boolean} props.isEdit - Whether this is edit mode
 * @param {string|number} props.id - Record ID
 * @param {boolean} props.isSubmitting - Loading state for save button
 * @param {Object} props.components - Map of { type: Component } (e.g. { text: CustomInput })
 */
// Memoize DynamicForm to prevent unnecessary re-renders if parent props (like generic PageData) change but form props don't.
const DynamicForm = React.memo(React.forwardRef(({ 
    DataPage,
    ResourcePage,
    onSave, 
    onSubmit,
    onBack,
    isEdit = false,
    id,
    isSubmitting = false,
    components = {},
    initialData = {} 
}, ref) => {
    const { formSchema } = DataPage || {};
    const { sections } = formSchema || {};
    
    // Load generallist options for select fields
    const { getGenerallist } = useGetGenerallist();
    const [generallistOptions, setGenerallistOptions] = useState({});
    const [isLoadingOptions, setIsLoadingOptions] = useState(false);

    // Memoize the list of generallists needed
    const generallistNames = useMemo(() => {
        if (!sections) return [];
        const names = new Set();
        sections.forEach(section => {
            section.fields.forEach(field => {
                if (field.generallist) {
                    names.add(field.generallist);
                }
            });
        });
        return Array.from(names);
    }, [sections]);

    useEffect(() => {
        if (generallistNames.length === 0) return;
        
        let isMounted = true;
        
        const loadOptions = async () => {
            setIsLoadingOptions(true);
            const options = {};
            
            for (const name of generallistNames) {
                await getGenerallist(
                    name,
                    () => {},
                    (data) => { 
                        if (isMounted) {
                            options[name] = data; 
                        }
                    }
                );
            }
            
            if (isMounted) {
                setGenerallistOptions(options);
                setIsLoadingOptions(false);
            }
        };
        
        loadOptions();
        
        return () => {
            isMounted = false;
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [generallistNames.join(',')]); // Only depend on generallist names, not the hook function

    // 1. Initialize Formik
    const createValidationSchema = (sections) => {
        // ... (existing validation logic)
        if (!sections) return Yup.object();

        return Yup.object().shape(
            sections.reduce((acc, section) => {
                section.fields.forEach(field => {
                    let schema;
                    switch (field.type) {
                        case 'number': schema = Yup.number().typeError('Must be a number'); break;
                        case 'email': schema = Yup.string().email('Invalid email format'); break;
                        case 'date': schema = Yup.date().nullable().typeError('Invalid date'); break;
                        case 'checkbox': schema = Yup.boolean(); break;
                        default: schema = Yup.string();
                    }
                    if (field.validation) {
                         if (field.validation.required) schema = schema.required(field.validation.message || `${field.label || 'Field'} is required`);
                         if (field.validation.min !== undefined) schema = field.type === 'number' ? schema.min(field.validation.min) : schema.min(field.validation.min);
                         if (field.validation.max !== undefined) schema = field.type === 'number' ? schema.max(field.validation.max) : schema.max(field.validation.max);
                         if (field.validation.matches) schema = schema.matches(new RegExp(field.validation.matches), field.validation.message);
                         if (field.validation.email) schema = schema.email(field.validation.message);
                    } else if (field.required) {
                        schema = schema.required(`${field.label || 'Field'} is required`);
                    }
                    acc[field.name] = schema;
                });
                return acc;
            }, {})
        );
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: sections ? sections.reduce((acc, section) => {
            section.fields.forEach(field => {
                acc[field.name] = initialData[field.name] !== undefined 
                    ? initialData[field.name] 
                    : (field.defaultValue !== undefined ? field.defaultValue : ''); 
            });
            return acc;
        }, {}) : {},
        validationSchema: createValidationSchema(sections),
        onSubmit: (values) => {
            onSave(values); 
        },
    });

    // Expose submitForm to parent via ref
    React.useImperativeHandle(ref, () => ({
        submitForm: formik.handleSubmit,
        isSubmitting: formik.isSubmitting
    }));

    // 2. Ref Management for Auto-Focus
    const fieldRefs = useRef(new Map());

    useLayoutEffect(() => {
        const firstField = sections?.[0]?.fields?.[0];
        if (firstField) {
             const node = fieldRefs.current.get(firstField.name);
             if (node && !node.disabled) node.focus();
        }
    }, [sections]);

    const renderField = useCallback((field) => {
        const Component = components[field.type];
        if (!Component) return <div key={field.name}>Missing {field.type}</div>;

        const handleChange = (field.type === 'select' || field.type === 'async-select')
            ? (e) => formik.setFieldValue(field.name, e) 
            : formik.handleChange;

        // Get options from generallist if specified
        const options = field.generallist 
            ? generallistOptions[field.generallist] || []
            : field.options;

        // For select with generallist, find the selected option object
        const selectValue = field.generallist && formik.values[field.name]
            ? options.find(opt => opt.value === formik.values[field.name]) || null
            : formik.values[field.name];

        return (
            <Component
                {...field}
                key={field.name}
                ref={(el) => {
                    if (el) fieldRefs.current.set(field.name, el);
                    else fieldRefs.current.delete(field.name);
                }}
                options={options}
                value={field.type === 'select' ? selectValue : formik.values[field.name]}
                onChange={handleChange}
                errors={formik.errors[field.name]}
                touched={formik.touched[field.name]}
                titleGenerallist={!!field.generallist}
                ResourcePage={field.generallist || field.ResourcePage || ResourcePage}
                isLoading={field.generallist ? isLoadingOptions : false}
                className="mb-4"
            />
        );
    }, [components, formik.values, formik.errors, formik.touched, formik.handleChange, formik.setFieldValue, generallistOptions, isLoadingOptions]); 

    return (
        <div className="flex-1">
            {/* Form Sections */}
            {sections?.map((section, idx) => (
                <div key={idx} className={idx > 0 ? "mt-8" : ""}>
                    {/* Section Fields */}
                    <div className="grid grid-cols-12 gap-x-6 gap-y-4">
                        {section.fields.map(field => (
                            <div key={field.name} className={field.gridWidth || 'col-span-12'}>
                                {renderField(field)}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}));

export default DynamicForm;
