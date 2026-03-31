/**
 * @fileoverview Filter Schemas
 *
 * Defines the "Advanced Filter Drawer" field configurations.
 *
 * Design note:
 * - Only define fields here that need SPECIAL handling (async-select, dependent lookups, generallist).
 * - FilterGrid.jsx will automatically render these MERGED with the page's standard column-based inputs.
 * - Standard text/date inputs are rendered automatically by FilterGrid using the column definitions.
 *
 * @module ConfigData/FilterSchemas
 */

// ─── Vendors ────────────────────────────────────────────────────────────────
export const VendorsFilter = {
    // Map: column key → override field definition
    // Keys listed here will override the auto-generated filter input for that column
    overrides: {
        dataAreaId: {
            name: "dataAreaId",
            label: "dataAreaId",
            type: "async-select",
            placeholder: "selectDataArea",
            lookup: {
                api: "Vendors/GetdataArea",
                labelKey: "name",
                valueKey: "legalEntityId"
            }
        },
        vendorGroupId: {
            name: "vendorGroupId",
            label: "vendorGroupId",
            type: "async-select",
            placeholder: "selectVendorGroup",
            lookup: {
                api: "VendorGroups/GetLookup",
                labelKey: "vendorGroupId",
                valueKey: "vendorGroupId"
            },
            dependsOn: "dataAreaId",
            filterOptionsBy: (options, values) => {
                if (!values?.dataAreaId) return options;
                return options.filter(
                    (opt) => opt.dataAreaId?.toLowerCase() === values.dataAreaId?.toLowerCase()
                );
            },
            isDisabled: (values) => !values?.dataAreaId
        },
        currencyCode: {
            name: "currencyCode",
            label: "currencyCode",
            type: "async-select",
            placeholder: "selectCurrency",
            lookup: {
                api: "Currencies/GetLookup",
                labelKey: "name",
                valueKey: "currencyCode"
            }
        },
        vendorPartyType: {
            name: "vendorPartyType",
            label: "vendorPartyType",
            type: "select",
            placeholder: "selectPartyType",
            generallist: "VendorPartyType"
        }
    }
};

// ─── Vendor Groups ───────────────────────────────────────────────────────────
export const VendorGroupsFilter = {
    overrides: {
        dataAreaId: {
            name: "dataAreaId",
            label: "dataAreaId",
            type: "async-select",
            placeholder: "selectDataArea",
            lookup: {
                api: "Vendors/GetdataArea",
                labelKey: "name",
                valueKey: "legalEntityId"
            }
        },
        vendorGroupId: {
            name: "vendorGroupId",
            label: "vendorGroupId",
            type: "async-select",
            placeholder: "selectVendorGroup",
            lookup: {
                api: "VendorGroups/GetLookup",
                labelKey: "vendorGroupId",
                valueKey: "vendorGroupId"
            },
            dependsOn: "dataAreaId",
            filterOptionsBy: (options, values) => {
                if (!values?.dataAreaId) return options;
                return options.filter(
                    (opt) => opt.dataAreaId?.toLowerCase() === values.dataAreaId?.toLowerCase()
                );
            },
            isDisabled: (values) => !values?.dataAreaId
        }
    }
};

