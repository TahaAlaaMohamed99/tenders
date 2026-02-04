import GenericGridPage from "../Components/GenericGridPage";
import GenericAddEditPage from "../Components/GenericAddEditPage";
import { VendorsGrid, VendorGroupsGrid, CurrenciesGrid, DepartmentsGrid, ItemsGrid, SubmissionDocumentsGrid } from "./GridSchemas";
import { VendorsFilter } from "./FilterSchemas";
import { VendorsActions } from "./ActionSchemas";
import { VendorsForm, VendorGroupsForm, CurrenciesForm, DepartmentsForm, ItemsForm, SubmissionDocumentsForm } from "./FormSchemas";

// Default/Fallback Schemas for pages that don't have specific ones yet
const DefaultGrid = { columns: [{ key: "id", title: "ID", width: 100 }] };
const DefaultForm = { sections: [{ title: "Info", fields: [] }] };

export const DataPages = {
    Dashboard: {
        Api: "dashboard",
        componentViwe: GenericGridPage,
        componentAddEdit: GenericAddEditPage,
        keyId: "id",
        isSelected: false,
        ...DefaultGrid,
        formSchema: DefaultForm
    },
    Journal: {
        Api: "Journal",
        componentViwe: GenericGridPage,
        componentAddEdit: GenericAddEditPage,
        keyId: "id",
        ...DefaultGrid,
        formSchema: DefaultForm
    },
    SubmissionDocuments: {
        Api: "SubmissionDocument",
        componentViwe: GenericGridPage,
        componentAddEdit: GenericAddEditPage,
        keyId: "recId",
        ExcelExport: true,
        isSearch: true,
        isFilterGrid: true,
        ...SubmissionDocumentsGrid,
        formSchema: SubmissionDocumentsForm
    },
    Reports: {
        Api: "Reports",
        componentViwe: GenericGridPage,
        componentAddEdit: GenericAddEditPage,
        keyId: "id",
        columns: [
            {
                key: "name",
                title: "description",
                width: 200,
                maxWidth: 220,
                minWidth:100,
                isFilter: true,
                fixed: true,
            }
        ],
        formSchema: DefaultForm
    },
    Setup: {
        Api: "Setup",
        componentViwe: GenericGridPage,
        componentAddEdit: GenericAddEditPage,
        keyId: "id",
        ...DefaultGrid,
        formSchema: DefaultForm
    },
    VendorGroups: {
        Api: "VendorGroups",
        componentViwe: GenericGridPage,
        componentAddEdit: GenericAddEditPage,
        keyId: "vendorGroupId",
        ExcelExport: true,
        isSearch: true,
        isFilterGrid: true,
        ...VendorGroupsGrid,
        formSchema: VendorGroupsForm
    },
    Currencies: {
        Api: "Currencies",
        componentViwe: GenericGridPage,
        componentAddEdit: GenericAddEditPage,
        keyId: "recId",
        ExcelExport: true,
        isSearch: true,
        isFilterGrid: true,
        ...CurrenciesGrid,
        formSchema: CurrenciesForm
    },
    Items: {
        Api: "Item",
        componentViwe: GenericGridPage,
        componentAddEdit: GenericAddEditPage,
        keyId: "recId",
        ExcelExport: true,
        isSearch: true,
        isFilterGrid: true,
        ...ItemsGrid,
        formSchema: ItemsForm
    },
    Departments: {
        Api: "Department",
        componentViwe: GenericGridPage,
        componentAddEdit: GenericAddEditPage,
        keyId: "recId",
        ExcelExport: true,
        isSearch: true,
        isFilterGrid: true,
        ...DepartmentsGrid,
        formSchema: DepartmentsForm
    },
    Settings: {
        Api: "Settings",
        componentViwe: GenericGridPage,
        componentAddEdit: GenericAddEditPage,
        keyId: "id",
         ...DefaultGrid,
        formSchema: DefaultForm
    },
    Vendors: {
        Api: "Vendors",
        componentViwe: GenericGridPage,
        componentAddEdit: GenericAddEditPage,
        keyId: "recId",
        isSelected: true,
        ExcelExport: true,
        isSearch: true,
        isFilterGrid: true,
        ...VendorsGrid,
        ...VendorsFilter,
        ...VendorsActions,
        formSchema: VendorsForm 
    }
};