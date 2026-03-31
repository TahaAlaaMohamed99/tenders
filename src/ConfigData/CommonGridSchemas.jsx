/**
 * Common Grid Columns
 * 
 * Reusable column definitions for data grids.
 * Import these to build specific page grids in DataPages.jsx / DataPagesLine.jsx.
 */

export const CommonColumns = {
    // -- Basic Fields --
    Code: {
        key: "code",
        title: "code",
        fixed: true,
        width: 150,
        maxWidth: 180,
        minWidth: 100,
        isFilter: true
    },
    Name: {
        key: "name",
        title: "name",
        width: 250,
        maxWidth: 350,
        isFilter: true
    },
    Description: {
        key: "description",
        title: "description",
        width: 300,
        maxWidth: 400,
        isFilter: true
    },
    CreatedOn: {
        key: "createdOn",
        title: "createdOn",
        hiddenMobile: true,
        width: 180,
        maxWidth: 220,
        type: "date"
    },
    
    // -- Common IDs / FKs --
    DataAreaId: {
        key: "dataAreaId",
        title: "dataAreaId",
        width: 150,
        maxWidth: 200,
        isFilter: true,
        // Used by ColumnFilterPopover to render an async-select instead of plain text
        filterLookup: {
            api: "Vendors/GetdataArea",
            labelKey: "name",
            valueKey: "legalEntityId"
        }
    },
    CurrencyCode: {
        key: "currencyCode",
        title: "currencyCode",
        width: 130,
        maxWidth: 160,
        isFilter: true,
        filterLookup: {
            api: "Currencies/GetLookup",
            labelKey: "name",
            valueKey: "currencyCode"
        }
    },

    // -- Item / Inventory --
    ItemNumber: {
        key: "itemNumber",
        title: "itemNumber",
        fixed: true,
        width: 150,
        maxWidth: 180,
        isFilter: true
    },
    
    // -- Status / Types --
    Status: {
        key: "status",
        title: "status",
        width: 120,
        maxWidth: 150,
        type: "status",
        generallist: "WorkflowStatus",
        className: "state_Primary"
    }
};

// Start of specific grids (Deprecated/Moved to DataPages.jsx)
// Keeping empty export if anything imports * from here to avoid breaking build immediately
// but content has been moved.
