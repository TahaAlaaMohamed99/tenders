import GenericGridPage from "../Components/GenericGridPage";
import GenericAddEditPage from "../Components/GenericAddEditPage";
import { VendorsGrid, VendorGroupsGrid, CurrenciesGrid, DepartmentsGrid, ItemsGrid, SubmissionDocumentsGrid } from "./GridSchemas";
import { VendorsFilter } from "./FilterSchemas";
import { VendorsActions } from "./ActionSchemas";
import { VendorsForm, VendorGroupsForm, CurrenciesForm, DepartmentsForm, ItemsForm, SubmissionDocumentsForm } from "./FormSchemas";
import SubmissionDocumentAddEdit from "../Pages/SubmissionDocumentAddEdit";
import DashboardPage from "../Pages/DashboardPage";

// Default/Fallback Schemas for pages that don't have specific ones yet
const DefaultGrid = { columns: [{ key: "id", title: "ID", width: 100 }] };
const DefaultForm = { sections: [{ title: "Info", fields: [] }] };

export const DataPages = {
    Dashboard: {
        Api: "dashboard",
        componentViwe: DashboardPage,
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
        formSchema: DefaultForm,
        titleAdd: "addJournal",
        titleEdit: "editJournal"
    },
    SubmissionDocuments: {
        Api: "SubmissionDocument",
        componentViwe: GenericGridPage,
        componentAddEdit: SubmissionDocumentAddEdit,
        keyId: "recId",
        ExcelExport: true,
        isSearch: true,
        isFilterGrid: true,
        ...SubmissionDocumentsGrid,
        formSchema: SubmissionDocumentsForm,
        titleAdd: "addSubmissionDocument",
        titleEdit: "editSubmissionDocument"
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
        formSchema: DefaultForm,
        titleAdd: "addReport",
        titleEdit: "editReport"
    },
    Setup: {
        Api: "Setup",
        componentViwe: GenericGridPage,
        componentAddEdit: GenericAddEditPage,
        keyId: "id",
        ...DefaultGrid,
        formSchema: DefaultForm,
        titleAdd: "addSetup",
        titleEdit: "editSetup"
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
        formSchema: VendorGroupsForm,
        titleAdd: "addVendorGroup",
        titleEdit: "editVendorGroup"
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
        formSchema: CurrenciesForm,
        titleAdd: "addCurrency",
        titleEdit: "editCurrency"
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
        formSchema: ItemsForm,
        titleAdd: "addItem",
        titleEdit: "editItem"
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
        formSchema: DepartmentsForm,
        titleAdd: "addDepartment",
        titleEdit: "editDepartment"
    },
    Settings: {
        Api: "Settings",
        componentViwe: GenericGridPage,
        componentAddEdit: GenericAddEditPage,
        keyId: "id",
         ...DefaultGrid,
        formSchema: DefaultForm,
        titleAdd: "addSetting",
        titleEdit: "editSetting"
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
        formSchema: VendorsForm,
        titleAdd: "addVendor",
        titleEdit: "editVendor"
    }
};