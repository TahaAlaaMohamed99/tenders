/**
 * Grid Schemas
 * 
 * Defines the structure of the data grid for each page.
 * 
 * Structure:
 * - columns: Array of column definitions.
 *   - key: Field name in the API response.
 *   - title: Header text (or localization key).
 *   - type: Data type (text, date, status, etc.) for formatting.
 *   - isFilter: Boolean, enables simple inline dropdown/input filter for this column.
 *   - isFilterSelect: Boolean, if true, forces the filter to be a Dropdown/Select instead of text input.
 *   - width/fixed: Layout properties.
 */
export const VendorsGrid = {
    columns: [
        {
            key: "code",
            title: "code",
            fixed: true,
            width: 150,
            maxWidth: 180,
            minWidth: 100,
            isFilter: true
        },
        {
            key: "name",
            title: "name",
            fixed: true,
            width: 200,
            maxWidth: 280,
            isFilter: true
        },
        {
            key: "vendorAccountNumber",
            title: "vendorAccountNumber",
            width: 180,
            maxWidth: 220,
            isFilter: true
        },
        {
            key: "vendorGroupId",
            title: "vendorGroupId",
            width: 150,
            maxWidth: 200,
            isFilter: true,
            type: "status",
            className: "state_Primary"
        },
        {
            key: "currencyCode",
            title: "currencyCode",
            width: 130,
            maxWidth: 160,
            isFilter: true
        },
        {
            key: "dataAreaId",
            title: "dataAreaId",
            width: 150,
            maxWidth: 180,
            isFilter: true
        },
        {
            key: "vendorPartyType",
            title: "vendorPartyType",
            width: 150,
            maxWidth: 200,
            type: "status",
            className: "state_Primary"
        },
        {
            key: "createdOn",
            title: "createdOn",
            hiddenMobile: true,
            width: 180,
            maxWidth: 220,
            type: "date"
        }
    ]
};

export const VendorGroupsGrid = {
    columns: [
        {
            key: "vendorGroupId",
            title: "vendorGroupId",
            fixed: true,
            width: 150,
            maxWidth: 180,
            minWidth: 100,
            isFilter: true
        },
        {
            key: "description",
            title: "description",
            width: 300,
            maxWidth: 400,
            isFilter: true
        },
        {
            key: "dataAreaId",
            title: "dataAreaId",
            width: 150,
            maxWidth: 200,
            isFilter: true
        }
    ]
};

export const CurrenciesGrid = {
    columns: [
        {
            key: "currencyCode",
            title: "currencyCode",
            fixed: true,
            width: 150,
            maxWidth: 180,
            minWidth: 100,
            isFilter: true
        },
        {
            key: "name",
            title: "name",
            width: 250,
            maxWidth: 350,
            isFilter: true
        },
        {
            key: "createdOn",
            title: "createdOn",
            width: 150,
            maxWidth: 180,
            type: "date"
        }
    ]
};

export const DepartmentsGrid = {
    columns: [
        {
            key: "code",
            title: "code",
            fixed: true,
            width: 120,
            maxWidth: 150,
            minWidth: 80,
            isFilter: true
        },
        {
            key: "name",
            title: "name",
            fixed: true,
            width: 250,
            maxWidth: 350,
            isFilter: true
        },
        {
            key: "operatingUnitNumber",
            title: "operatingUnitNumber",
            width: 150,
            maxWidth: 180,
            isFilter: true
        },
        {
            key: "operatingUnitType",
            title: "operatingUnitType",
            width: 150,
            maxWidth: 200,
            type: "status",
            className: "state_Primary"
        },
        {
            key: "createdOn",
            title: "createdOn",
            hiddenMobile: true,
            width: 180,
            maxWidth: 220,
            type: "date"
        }
    ]
};

export const ItemsGrid = {
    columns: [
        {
            key: "code",
            title: "code",
            fixed: true,
            width: 120,
            maxWidth: 150,
            minWidth: 80,
            isFilter: true
        },
        {
            key: "itemNumber",
            title: "itemNumber",
            fixed: true,
            width: 150,
            maxWidth: 180,
            isFilter: true
        },
        {
            key: "searchName",
            title: "searchName",
            width: 250,
            maxWidth: 350,
            isFilter: true
        },
        {
            key: "dataAreaId",
            title: "dataAreaId",
            width: 120,
            maxWidth: 150,
            isFilter: true
        },
        {
            key: "inventoryUnitSymbol",
            title: "inventoryUnitSymbol",
            width: 150,
            maxWidth: 180
        },
        {
            key: "productType",
            title: "productType",
            width: 130,
            maxWidth: 160,
            type: "status",
            generallist: "ProductType",
            className: "state_Primary"
        },
        {
            key: "createdOn",
            title: "createdOn",
            hiddenMobile: true,
            width: 180,
            maxWidth: 220,
            type: "date"
        }
    ]
};

export const SubmissionDocumentsGrid = {
    columns: [
        {
            key: "code",
            title: "code",
            fixed: true,
            width: 120,
            maxWidth: 150,
            minWidth: 80,
            isFilter: true
        },
        {
            key: "name",
            title: "name",
            fixed: true,
            width: 200,
            maxWidth: 280,
            isFilter: true
        },
        {
            key: "description",
            title: "description",
            width: 250,
            maxWidth: 350,
            isFilter: true
        },
        {
            key: "biddingType",
            title: "biddingType",
            width: 130,
            maxWidth: 160,
            type: "status",
            generallist: "BiddingType",
            className: "state_Primary"
        },
        {
            key: "status",
            title: "status",
            width: 120,
            maxWidth: 150,
            type: "status",
            generallist: "WorkflowStatus",
            className: "state_Primary"
        },
        {
            key: "transDate",
            title: "transDate",
            width: 150,
            maxWidth: 180,
            type: "date"
        },
        {
            key: "executionDate",
            title: "executionDate",
            width: 150,
            maxWidth: 180,
            type: "date"
        },
        {
            key: "createdOn",
            title: "createdOn",
            hiddenMobile: true,
            width: 180,
            maxWidth: 220,
            type: "date"
        }
    ]
};
