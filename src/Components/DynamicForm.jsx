import React, { useRef, useLayoutEffect, useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

/**
 * DynamicForm Component
 * 
 * Renders a form based on the schema and a PROVIDED component registry.
 * This allows each page to inject distinct custom components.
 * 
 * @param {Object} props
 * @param {Object} props.DataPage - Full page config from DataPages.jsx (contains formSchema)
 * @param {string} props.keyPage - Page Name (e.g. "Vendor")
 * @param {Function} props.onSave - Callback for Save button (receives form values)
 * @param {Function} props.onDelete - Callback for Delete button
 * @param {Function} props.onBack - Callback for Back/Return button
 * @param {number|string} props.recId - Record ID (0 for Add, >0 for Edit)
 * @param {Object} props.components - Map of { type: Component } (e.g. { text: CustomInput })
 */
// Memoize DynamicForm to prevent unnecessary re-renders if parent props (like generic PageData) change but form props don't.
const DynamicForm = React.memo(({ 
    keyPage, 
    DataPage,
    onSave, 
    onDelete, 
    onBack, 
    recId = 0,
    components = {} 
}) => {
    const { formSchema } = DataPage || {};
    const { sections } = formSchema || {};

    // 1. Initialize Formik
    // Enhanced Schema Builder for robust, configuration-based validation
    const createValidationSchema = (sections) => {
        if (!sections) return Yup.object();

        return Yup.object().shape(
            sections.reduce((acc, section) => {
                section.fields.forEach(field => {
                    let schema;

                    // Base Type Validation
                    switch (field.type) {
                        case 'number':
                            schema = Yup.number().typeError('Must be a number');
                            break;
                        case 'email':
                            schema = Yup.string().email('Invalid email format');
                            break;
                        case 'date':
                            schema = Yup.date().nullable().typeError('Invalid date');
                            break;
                        case 'checkbox':
                            schema = Yup.boolean();
                            break;
                        default:
                            schema = Yup.string();
                    }

                    // Apply Validation Rules from Configuration
                    if (field.validation) {
                         // Required
                         if (field.validation.required) {
                             schema = schema.required(field.validation.message || `${field.label || 'Field'} is required`);
                         }
                         
                         // Min Length / Min Value
                         if (field.validation.min !== undefined) {
                             schema = field.type === 'number' 
                                ? schema.min(field.validation.min, `Min value is ${field.validation.min}`)
                                : schema.min(field.validation.min, `Min length is ${field.validation.min} characters`);
                         }

                         // Max Length / Max Value
                         if (field.validation.max !== undefined) {
                            schema = field.type === 'number' 
                               ? schema.max(field.validation.max, `Max value is ${field.validation.max}`)
                               : schema.max(field.validation.max, `Max length is ${field.validation.max} characters`);
                         }

                         // Regex Pattern
                         if (field.validation.matches) {
                             schema = schema.matches(new RegExp(field.validation.matches), field.validation.message || 'Invalid format');
                         }
                         
                         // Email (explicit flag override)
                         if (field.validation.email) {
                             schema = schema.email(field.validation.message || 'Invalid email');
                         }
                    } 
                    // Legacy support for flat "required" prop if validation obj missing
                    else if (field.required) {
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
                acc[field.name] = field.defaultValue !== undefined ? field.defaultValue : ''; 
            });
            return acc;
        }, {}) : {},
        validationSchema: createValidationSchema(sections),
        onSubmit: (values) => {
            onSave(values); 
        },
    });

    // 2. Ref Management for Auto-Focus
    // We use a Map to store refs for all fields dynamically
    const fieldRefs = useRef(new Map());

    // 3. Auto-Focus Logic (The Enterprise Polish)
    // useLayoutEffect fires synchronously after all DOM mutations.
    // This ensures the input is focused BEFORE the browser paints, preventing any visual "snap" of focus.
    useLayoutEffect(() => {
        // Find the first field in the first section
        const firstField = sections?.[0]?.fields?.[0];
        if (firstField) {
             const node = fieldRefs.current.get(firstField.name);
             if (node && !node.disabled) {
                 node.focus();
             }
        }
    }, [sections]); // Runs when sections (schema) loads/changes

    // 4. Component Renderer
    // Using useCallback prevents this function from being recreated on every render,
    // although for simple forms the performance impact is negligible, for infinite scaling it's good practice.
    const renderField = useCallback((field) => {
        const Component = components[field.type];

        if (!Component) {
            return (
                <div key={field.name} className="text-red-500 text-xs border border-red-300 p-2 rounded bg-red-50">
                    Missing Component for type: <strong>{field.type}</strong>
                </div>
            );
        }

        // Pass handlers dynamically based on component type requirement
        // We use `formik.setFieldValue` for custom Selects usually.
        const handleChange = field.type === 'select' 
            ? (e) => formik.setFieldValue(field.name, e) 
            : formik.handleChange;

        return (
            <Component
                {...field} // SPREAD PROPS: Allows infinite customization from Schema
                key={field.name}
                // Attach Ref to the Map
                ref={(el) => {
                    if (el) fieldRefs.current.set(field.name, el);
                    else fieldRefs.current.delete(field.name);
                }}
                value={formik.values[field.name]}
                onChange={handleChange}
                errors={formik.errors[field.name]}
                touched={formik.touched[field.name]}
                className="mb-4"
            />
        );
    }, [components, formik.values, formik.errors, formik.touched, formik.handleChange, formik.setFieldValue]); 

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                     <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                        {sections?.[0]?.title || `${keyPage} Info`}
                    </h2>
                </div>
                
                <div className="flex items-center gap-3">
                    {/* Delete Button logic:
                        1. Must be Edit Mode (recId > 0)
                        2. Parent must have passed an onDelete handler (allows disabling via RBAC)
                    */}
                    {Number(recId) > 0 && onDelete && (
                        <button 
                            type="button"
                            onClick={onDelete}
                            className="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium rounded-lg transition-colors border border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
                        >
                            Delete
                        </button>
                    )}

                    <button 
                        type="button"
                        onClick={formik.handleSubmit}
                        disabled={formik.isSubmitting} // Disable while submitting
                        className={`flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium rounded-lg transition-colors border border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 ${formik.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {formik.isSubmitting ? 'Saving...' : 'Save'}
                    </button>

                    <button 
                        type="button"
                        onClick={onBack}
                        className="p-2 bg-slate-800 hover:bg-slate-900 text-white rounded-full transition-colors"
                        title="Go Back"
                    >
                        <span className="text-xl leading-none">&larr;</span>
                    </button>
                </div>
            </div>

            {/* Form Sections */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                {sections?.map((section, idx) => (
                    <div key={idx}>
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 border-b pb-2">
                             {section.title}
                        </h3>
                        <div className="grid grid-cols-12 gap-6">
                            {section.fields.map(field => (
                                <div key={field.name} className={field.gridWidth || 'col-span-12'}>
                                    {renderField(field)}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default DynamicForm;
