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
 */
export const VendorsForm = {
    sections: [
        {
            title: "Vendor Info",
            fields: [
                { 
                    name: "name", 
                    label: "Name", 
                    type: "text", 
                    required: true, 
                    gridWidth: "col-span-6", 
                    placeholder: "ABC Corp Inc.", 
                    // PROPS PASSED HERE GO DIRECTLY TO CustomInput
                    dir: "ltr", 
                    autoComplete: "off" 
                },
                { name: "dataArea", label: "Data Area", type: "text", required: true, gridWidth: "col-span-6", placeholder: "EU Operations" },
                { 
                    name: "vendorGroup", 
                    label: "Vendor Group", 
                    type: "select", 
                    required: true, 
                    gridWidth: "col-span-6", 
                    placeholder: "Global Suppliers Ltd."
                },
                { 
                    name: "currencyCode", 
                    label: "Currency Code", 
                    type: "select", 
                    required: true, 
                    gridWidth: "col-span-6", 
                    placeholder: "USD"
                }
            ]
        }
    ]
};
