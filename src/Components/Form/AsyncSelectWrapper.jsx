import { useState, useEffect, useMemo } from 'react';
import CustomeSelect from './CustomSelect'; // Correct path to CustomSelect
import { Api } from '../../services/Api';

/**
 * AsyncSelectWrapper
 * 
 * Fetches options from an API endpoint and renders CustomeSelect.
 * Handles value conversion between string (API) and object (react-select).
 * 
 * @param {Object} props
 * @param {Object} props.lookup - Configuration for fetching data
 * @param {string} props.lookup.api - API Endpoint (e.g. "Vendors/GetdataArea")
 * @param {string} props.lookup.labelKey - Key for label (e.g. "name")
 * @param {string} props.lookup.valueKey - Key for value (e.g. "legalEntityId")
 * @param {any} props.value - Current value (can be string or object)
 * @param {Function} props.onChange - Change handler
 */
const AsyncSelectWrapper = ({ lookup, gridWidth, validation, value, onChange, ref, ...props }) => {
    const [options, setOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOptions = async () => {
            if (!lookup || !lookup.api) {
                setOptions(props.options || []);
                setIsLoading(false);
                return;
            }

            try {
                // Determine if we need to append query params or just a straight GET
                // Usually lookups are simple GETs
                const response = await Api.get(lookup.api);
                
                // Handle various response structures (array vs { data: [] } vs { result: [] })
                // Assuming response is the array or contains it.
                // Adapting based on project patterns (typically response is the data directly or we need to extract)
                const data = Array.isArray(response) ? response : (response.data || response.result || []);

                if (Array.isArray(data)) {
                    const mapped = data.map(item => ({
                        value: item[lookup.valueKey || 'id'],
                        label: item[lookup.labelKey || 'name'],
                        ...item, // Spread original item properties so filterOptionsBy can access them
                        original: item
                    }));
                    setOptions(mapped);
                } else {
                    console.error("AsyncSelectWrapper: Expected array response", response);
                    setOptions([]);
                }
            } catch (err) {
                console.error("AsyncSelectWrapper: Fetch failed", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOptions();
    }, [lookup?.api, lookup?.labelKey, lookup?.valueKey]);

    // Filter options if filterOptionsBy is provided
    const filteredOptions = useMemo(() => {
        if (typeof props.filterOptionsBy === 'function' && props.formValues) {
            return props.filterOptionsBy(options, props.formValues);
        }
        return options;
    }, [options, props.filterOptionsBy, props.formValues]);

    // useEffect(() => {
    //     console.log('[AsyncSelectWrapper] Value:', value, 'Type:', typeof value);
    // }, [value]);

    // useEffect(() => {
    //     console.log('[AsyncSelectWrapper] Filtered Options:', filteredOptions);
    // }, [filteredOptions]);

    // Convert string value to object for react-select
    const selectedValue = useMemo(() => {
        if (value === null || value === undefined || value === '') return null;
        
        // If already an object with value property, use it
        if (typeof value === 'object' && value !== null && 'value' in value) {
            return value;
        }
        
        // If string or number, find matching option or create one
        if (typeof value === 'string' || typeof value === 'number') {
            const found = filteredOptions.find(opt => opt.value == value);
            if (found) {
                return found;
            }
            // Fallback: create option from value
            return { value: value, label: value };
        }
        
        return null;
    }, [value, filteredOptions]);

    // Handle change - extract value for form state
    const handleChange = (selected) => {
        // console.log('[AsyncSelectWrapper] handleChange selected:', selected);
        // Pass the value string to the form, not the whole object
        const newValue = selected ? selected.value : '';
        onChange(newValue);
        if (props.onSelectionChange) {
            props.onSelectionChange(selected);
        }
    };

    return (
        <CustomeSelect
            {...props}
            ref={ref}
            options={filteredOptions}
            isLoading={isLoading}
            ResourcePage={props.ResourcePage || lookup?.ResourcePage}
            value={selectedValue}
            onChange={handleChange}
            menuPortalTarget={document.body}
            menuPosition="fixed"
        />
    );
};

export default AsyncSelectWrapper;
