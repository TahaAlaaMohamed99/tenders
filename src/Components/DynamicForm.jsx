import { useRef, useLayoutEffect, useCallback, useState, useEffect, useMemo, memo, useImperativeHandle } from 'react';
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
const DynamicForm = memo(function DynamicForm({ 
    DataPage,
    ResourcePage,
    onSave, 
    onSubmit,
    onBack,
    isEdit = false,
    id,
    viewOnly = false,
    isSubmitting = false,
    components = {},
    initialData = {},
    ref 
}) {
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
                section.fields.forEach((field) => {
                    let schema;
                    switch (field.type) {
                        case "number":
                            schema = Yup.number().typeError("Must be a number");
                            break;
                        case "email":
                            schema = Yup.string().email("Invalid email format");
                            break;
                        case "date":
                        case "datetime":
                            schema = Yup.date().nullable().typeError("Invalid date");
                            break;
                        case "checkbox":
                            schema = Yup.boolean();
                            break;
                        case "select":
                        case "async-select":
                            schema = Yup.mixed();
                            break;
                        default:
                            schema = Yup.string();
                    }
                    // Support both nested 'validation' object and root-level attributes
                    const v = field.validation || {};
                    
                    if ((v.required || field.required) && !(isEdit && field.type === 'password')) {
                        schema = schema.required(v.message || `${field.label || "Field"} is required`);
                    }

                    if (field.type === 'number') {
                        const min = v.min !== undefined ? v.min : field.min;
                        const max = v.max !== undefined ? v.max : field.max;
                        if (min !== undefined) schema = schema.min(min, `Must be at least ${min}`);
                        if (max !== undefined) schema = schema.max(max, `Must be at most ${max}`);
                    } else {
                        // For strings, map min/max/minLength/maxLength to Yup length validation
                        const minLen = v.minLength !== undefined ? v.minLength : (field.minLength !== undefined ? field.minLength : (v.min !== undefined ? v.min : field.min));
                        const maxLen = v.maxLength !== undefined ? v.maxLength : (field.maxLength !== undefined ? field.maxLength : (v.max !== undefined ? v.max : field.max));
                        
                        if (minLen !== undefined) schema = schema.min(minLen, `Must be at least ${minLen} characters`);
                        if (maxLen !== undefined) schema = schema.max(maxLen, `Must be at most ${maxLen} characters`);
                    }

                    const pattern = v.matches || field.pattern;
                    if (pattern) {
                         schema = schema.matches(new RegExp(pattern), v.message || "Invalid format");
                    }

                    if (v.email) {
                        schema = schema.email(v.message || "Invalid email format");
                    }

                    if (field.mustMatch) {
                        schema = schema.oneOf(
                            [Yup.ref(field.mustMatch), null],
                            v.matchMessage || "passwordsMustMatch"
                        );
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
                acc[field.name] = initialData[field.name] ?? (field.defaultValue ?? ''); 
            });
            return acc;
        }, {}) : {},
        validationSchema: createValidationSchema(sections),
        onSubmit: (values) => {
            onSave(values); 
        },
    });

    // Expose submitForm to parent via ref
    useImperativeHandle(ref, () => ({
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

    // Calculate dependencies
    const dependencyMap = useMemo(() => {
        const deps = {};
        if (sections) {
            sections.forEach(section => {
                section.fields.forEach(field => {
                    if (field.dependsOn) {
                        if (!deps[field.dependsOn]) deps[field.dependsOn] = [];
                        deps[field.dependsOn].push(field.name);
                    }
                });
            });
        }
        return deps;
    }, [sections]);

    const renderField = useCallback((field) => {
        const Component = components[field.type];
        if (!Component) {
            // Phase 3: Added console error for missing component types
            // @see docs/06-unused-and-gaps.md#112-dynamicform-missing-component-error
            console.error(`[DynamicForm] Missing component for field type: "${field.type}" (field: "${field.name}")`);
            return (
                <div key={field.name} className="text-error text-sm p-2 border border-error rounded">
                    Unsupported field type: {field.type}
                </div>
            );
        }

        const handleChange = (e) => {
            if (field.type === 'select' || field.type === 'async-select') {
                formik.setFieldValue(field.name, e);
            } else {
                formik.handleChange(e);
            }

            // Clear dependent fields if any
            if (dependencyMap[field.name]) {
                dependencyMap[field.name].forEach(depField => {
                    formik.setFieldValue(depField, '');
                });
            }
        };

        // Get options from generallist if specified
        let options = field.generallist 
            ? generallistOptions[field.generallist] || []
            : field.options;

        // Apply filterOptionsBy if present in schema
        if (typeof field.filterOptionsBy === "function" && Array.isArray(options)) {
          options = field.filterOptionsBy(options, formik.values);
        }

        // For select with generallist, find the selected option object
        const selectValue =
          field.generallist && formik.values[field.name]
            ? options.find(
                (opt) => opt.value === formik.values[field.name],
              ) || null
            : formik.values[field.name];

        // Support isDisabled from schema
        const isDisabled =
          typeof field.isDisabled === "function"
            ? field.isDisabled(formik.values)
            : field.isDisabled;

        // Support dynamic placeholder from schema (function or static)
        let placeholder = field.placeholder;
        if (typeof field.placeholder === "function") {
          placeholder = field.placeholder(formik.values, field, formik);
        }

        return (
          <Component
            {...field}
            key={field.name}
            ref={(el) => {
              if (el) fieldRefs.current.set(field.name, el);
              else fieldRefs.current.delete(field.name);
            }}
            options={options}
            value={
              field.type === "select"
                ? selectValue
                : formik.values[field.name]
            }
            onChange={handleChange}
            onBlur={formik.handleBlur}
            errors={formik.errors[field.name]}
            touched={formik.touched[field.name]}
            titleGenerallist={!!field.generallist}
            ResourcePage={
              field.generallist || field.ResourcePage || ResourcePage
            }
            isLoading={field.generallist ? isLoadingOptions : false}
            isDisabled={isDisabled}
            placeholder={placeholder}
            formValues={formik.values}
            className="mb-4"
            Required={(field.required || field.validation?.required) && !(isEdit && field.type === 'password')}
          />
        );
      },
      [
        components,
        formik.values,
        formik.errors,
        formik.touched,
        formik.handleChange,
        formik.handleBlur,
        formik.setFieldValue,
        generallistOptions,
        isLoadingOptions,
        dependencyMap,
        ResourcePage
      ],
    );

    return (
      <div className={`flex-1 ${viewOnly ? "view_only" : ""}`}>
        {/* Form Sections */}
        {sections?.map((section, idx) => (
          <div key={idx} className={idx > 0 ? "mt-8" : ""}>
            {/* Section Fields */}
            <div className="grid grid-cols-12 gap-x-6 gap-y-4">
              {section.fields.map((field) => (
                <div
                  key={field.name}
                  className={field.gridWidth || "col-span-12"}
                >
                  {renderField(field)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      );
}
);

export default DynamicForm;
