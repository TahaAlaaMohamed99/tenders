import React, { useEffect, useState, useMemo, useCallback } from 'react';
import DynamicForm from '../Components/DynamicForm';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

// Hooks
import useHandleSubmit from '../Hooks/useHandleSubmit';
import useHandleDelete from '../Hooks/useHandleDelete';
import useGetById from '../Hooks/useGetById';
import useGetLookup from '../Hooks/useGetLookup'; // <--- Import Lookup Hook
import useCurrencyOptions from '../Hooks/useCurrencyOptions'; // <--- Import Currency Hook

// Components
import CustomInput from '../Components/Form/CustomInput';
import CustomeSelect from '../Components/Form/CustomSelect';

export default function VendorsAddEdit(props) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const recId = id || state?.RecId || 0;

  // 1. API Hooks
  const { handleSubmitFormik } = useHandleSubmit();
  const { handleDelete: apiHandleDelete } = useHandleDelete();
  const { getLookup } = useGetLookup(); // <--- Init Lookup Hook
  const currencyOptions = useCurrencyOptions(); // <--- Init Currency Hook (returns list)
  
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [vendorGroups, setVendorGroups] = useState([]); // <--- State for Vendor Groups

  // 2. Fetch Data (Edit Mode)
  const fetchData = useGetById(
      props.DataPage?.Api || "Vendors",
      recId, 
      setIsLoading, 
      setData, 
      props.PageUrl, 
      props.ResourcePage
  );

  // 3. Fetch Lookups
  useEffect(() => {
    // Fetch Record if Edit
    if (recId > 0) fetchData();

    // Fetch Vendor Groups Lookup
    getLookup(
        "VendorGroups", // API Endpoint
        "name",         // Label Key
        null, 
        "id",           // Value Key
        setIsLoading, 
        setVendorGroups // Set State
    );
  }, [recId]);

  // 4. Component Registry - MEMOIZED to prevent recreating the object map on every render
  // This is crucial for performance so `DynamicForm` doesn't re-render excessively.
  const vendorComponents = useMemo(() => ({
      // Method 1: standard mapping (props come from Schema)
      'select': CustomeSelect,
      
      // Method 2: Wrapped Component (props come from HERE + Schema)
      'text': (props) => <CustomInput {...props} labelBgColor="bg-gray-100 dark:bg-gray-800" />,
  }), []);

  // 5. Lookups Map - MEMOIZED
  const lookups = useMemo(() => ({
      vendorGroup: vendorGroups,
      currencyCode: currencyOptions
  }), [vendorGroups, currencyOptions]);

  const handleSave = useCallback((values) => {
    handleSubmitFormik({
        apiPage: props.DataPage?.Api || "Vendors",
        values: values,
        recId: recId,
        navigateTo: -1, 
        onSuccess: () => toast.success("Saved Successfully")
    });
  }, [handleSubmitFormik, props.DataPage?.Api, recId]);

  const handleDelete = useCallback(() => {
    if(window.confirm("Delete this record?")) {
        apiHandleDelete({
            apiPage: props.DataPage?.Api || "Vendors",
            recId: recId,
            navigateTo: -1,
            onSuccess: () => toast.info("Deleted")
        });
    }
  }, [apiHandleDelete, props.DataPage?.Api, recId]);

  return (
    <DynamicForm 
        {...props} 
        recId={recId}
        // Enrich Schema with Data AND Options
        DataPage={{ 
            ...props.DataPage, 
            formSchema: { 
                ...props.DataPage?.formSchema, 
                sections: populateSchema(props.DataPage?.formSchema?.sections, data, lookups) 
            } 
        }}
        components={vendorComponents}
        onSave={handleSave}
        onDelete={handleDelete}
        onBack={() => navigate(-1)}
    />
  );
}

// Helper: Populate Schema with Fetched Data AND Options
const populateSchema = (sections, data, lookups) => {
    if (!sections) return sections;
    return sections.map(section => ({
        ...section,
        fields: section.fields.map(field => ({
            ...field,
            // 1. Inject Data (Edit Mode)
            defaultValue: data ? data[field.name] : '',
            // 2. Inject Options (If exists in lookups map)
            options: lookups[field.name] || field.options || []
        }))
    }));
};
