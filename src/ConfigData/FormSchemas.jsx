/**
 * Form Schemas
 * 
 * Defines the structure for Add/Edit pages.
 * 
 * Structure:
 * - sections: Array of groups to organize fields.
 *   - title: Section header (e.g., "Vendor Info").
 *   - fields: Array of input definitions.
 *     - name: API field key.
 *     - label: Display label.
 *     - type: Input type (text, select, date, etc.).
 *     - required: Boolean or validation rule.
 *     - gridWidth: Layout sizing (e.g., "col-span-6").
 *     - generallist: (for select type) Name in Generallist.json for dropdown options.
 */
export const VendorsForm = {
    sections: [
        {
            title: "Vendor Info",
            fields: [
                { 
                    name: "name", 
                    label: "name", 
                    type: "text", 
                    required: true, 
                    gridWidth: "col-span-6", 
                    placeholder: "enterName",
                    autoComplete: "off" 
                },
                {
                    name: "dataAreaId",
                    label: "dataAreaId",
                    type: "async-select",
                    required: true,
                    gridWidth: "col-span-6",
                    placeholder: "selectDataArea",
                    lookup: {
                        api: "Vendors/GetdataArea",
                        labelKey: "name",
                        valueKey: "legalEntityId"
                    }
                },
                {
                    name: "vendorGroupId",
                    label: "vendorGroupId",
                    type: "async-select",
                    required: true,
                    gridWidth: "col-span-6",
                    placeholder: "selectVendorGroup",
                    lookup: {
                        api: "VendorGroups/GetLookup",
                        labelKey: "vendorGroupId",
                        valueKey: "vendorGroupId"
                    }
                },
                {
                    name: "currencyCode",
                    label: "currencyCode",
                    type: "async-select",
                    required: true,
                    gridWidth: "col-span-6",
                    placeholder: "selectCurrency",
                    lookup: {
                        api: "Currencies/GetLookup",
                        labelKey: "name",
                        valueKey: "currencyCode"
                    }
                }
            ]
        }
    ]
};
export const VendorGroupsForm = {
    sections: [
        {
            title: "Vendor Group Info",
            fields: [
                {
                    name: "dataAreaId",
                    label: "dataAreaId",
                    type: "async-select",
                    required: true,
                    gridWidth: "col-span-6",
                    placeholder: "selectDataArea",
                    lookup: {
                        api: "Vendors/GetdataArea",
                        labelKey: "name",
                        valueKey: "legalEntityId"
                    }
                },
                {
                    name: "vendorGroupId",
                    label: "vendorGroupId",
                    type: "text",
                    required: true,
                    gridWidth: "col-span-6",
                    placeholder: "enterVendorGroupId"
                },
                {
                    name: "description",
                    label: "description",
                    type: "text",
                    required: true,
                    gridWidth: "col-span-12",
                    placeholder: "enterDescription"
                }
            ]
        }
    ]
};

export const CurrenciesForm = {
    sections: [
        {
            title: "Currency Info",
            fields: [
                 {
                    name: "name",
                    label: "name",
                    type: "text",
                    required: true,
                    gridWidth: "col-span-6",
                    placeholder: "enterName"
                },
                {
                    name: "currencyCode",
                    label: "currencyCode",
                    type: "text", // Using text for now as we don't have a lookup API for codes yet
                    required: true,
                    gridWidth: "col-span-6",
                    placeholder: "USD"
                }
            ]
        }
    ]
};

export const DepartmentsForm = {
    sections: [
        {
            title: "Department Info",
            fields: [
                {
                    name: "name",
                    label: "name",
                    type: "text",
                    required: true,
                    gridWidth: "col-span-6",
                    placeholder: "enterName"
                },
                {
                    name: "operatingUnitNumber",
                    label: "operatingUnitNumber",
                    type: "text",
                    required: true,
                    gridWidth: "col-span-6",
                    placeholder: "enterUnitNumber"
                },
                {
                    name: "operatingUnitType",
                    label: "operatingUnitType",
                    type: "text",
                    required: false,
                    gridWidth: "col-span-6",
                    placeholder: "enterUnitType"
                }
            ]
        }
    ]
};

export const ItemsForm = {
    sections: [
        {
            title: "Item Info",
            fields: [
                {
                    name: "itemNumber",
                    label: "itemNumber",
                    type: "text",
                    required: true,
                    gridWidth: "col-span-6",
                    placeholder: "enterItemNumber"
                },
                {
                    name: "searchName",
                    label: "searchName",
                    type: "text",
                    required: true,
                    gridWidth: "col-span-6",
                    placeholder: "enterSearchName"
                },
                {
                    name: "dataAreaId",
                    label: "dataAreaId",
                    type: "text",
                    required: false,
                    gridWidth: "col-span-6",
                    placeholder: "enterDataArea"
                },
                {
                    name: "inventoryUnitSymbol",
                    label: "inventoryUnitSymbol",
                    type: "number",
                    required: false,
                    gridWidth: "col-span-6",
                    placeholder: "enterUnitSymbol"
                },
                {
                    name: "productType",
                    label: "productType",
                    type: "number",
                    required: false,
                    gridWidth: "col-span-6",
                    placeholder: "enterProductType"
                }
            ]
        }
    ]
};

export const SubmissionDocumentsForm = {
    sections: [
        {
            title: "Document Info",
            fields: [
                {
                    name: "name",
                    label: "name",
                    type: "text",
                    required: true,
                    gridWidth: "col-span-6",
                    placeholder: "enterName"
                },
                {
                    name: "biddingType",
                    label: "biddingType",
                    type: "select",
                    required: true,
                    gridWidth: "col-span-6",
                    placeholder: "selectBiddingType",
                    generallist: "BiddingType"
                },
                {
                    name: "transDate",
                    label: "transDate",
                    type: "dateTime",
                    required: false,
                    gridWidth: "col-span-6",
                    placeholder: "selectTransDate"
                },
                {
                    name: "executionDate",
                    label: "executionDate",
                    type: "dateTime",
                    required: false,
                    gridWidth: "col-span-6",
                    placeholder: "selectExecutionDate"
                },
                {
                    name: "description",
                    label: "description",
                    type: "textarea",
                    required: false,
                    gridWidth: "col-span-12",
                    placeholder: "enterDescription"
                }
            ]
        }
    ]
};

export const SubmissionDocumentLinesForm = {
    sections: [
        {
            title: "Document Line Info",
            fields: [
                {
                    name: "name",
                    label: "name",
                    type: "text",
                    required: true,
                    gridWidth: "col-span-6",
                    placeholder: "enterName"
                },
                {
                    name: "biddingType",
                    label: "biddingType",
                    type: "select",
                    required: true,
                    gridWidth: "col-span-6",
                    placeholder: "selectBiddingType",
                    generallist: "BiddingType"
                },
                {
                    name: "transDate",
                    label: "transDate",
                    type: "dateTime",
                    required: false,
                    gridWidth: "col-span-6",
                    placeholder: "selectTransDate"
                },
                {
                    name: "executionDate",
                    label: "executionDate",
                    type: "dateTime",
                    required: false,
                    gridWidth: "col-span-6",
                    placeholder: "selectExecutionDate"
                },
                {
                    name: "description",
                    label: "description",
                    type: "textarea",
                    required: false,
                    gridWidth: "col-span-12",
                    placeholder: "enterDescription"
                }
            ]
        }
    ]
};