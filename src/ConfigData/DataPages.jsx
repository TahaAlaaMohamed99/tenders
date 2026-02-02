import Vendors from "../Pages/Vendors";
import VendorsAddEdit from "../Pages/VendorsAddEdit";
import PlaceholderPage from "../Components/PlaceholderPage";
import { VendorsGrid } from "./GridSchemas";
import { VendorsFilter } from "./FilterSchemas";
import { VendorsActions } from "./ActionSchemas";
import { VendorsForm } from "./FormSchemas";

export const DataPages = {
    Dashboard: {
        Api: "dashboard",
        componentViwe: PlaceholderPage,
        componentAddEdit: PlaceholderPage,
        keyId: "id",
        isSelected: false,
    },
    Journal: {
        Api: "Journal",
        componentViwe: PlaceholderPage,
        componentAddEdit: PlaceholderPage,
        keyId: "id",
    },
    SubmissionDocuments: {
        Api: "SubmissionDocuments",
        componentViwe: PlaceholderPage,
        componentAddEdit: PlaceholderPage,
        keyId: "id",
    },
    Reports: {
        Api: "Reports",
        componentViwe: PlaceholderPage,
        componentAddEdit: PlaceholderPage,
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
        ]
    },
    Setup: {
        Api: "Setup",
        componentViwe: PlaceholderPage,
        componentAddEdit: PlaceholderPage,
        keyId: "id",
    },
    VendorGroups: {
        Api: "VendorGroups",
        componentViwe: PlaceholderPage,
        componentAddEdit: PlaceholderPage,
        keyId: "id",
    },
    Currencies: {
        Api: "Currencies",
        componentViwe: PlaceholderPage,
        componentAddEdit: PlaceholderPage,
        keyId: "id",
    },
    Items: {
        Api: "Items",
        componentViwe: PlaceholderPage,
        componentAddEdit: PlaceholderPage,
        keyId: "id",
    },
    Departments: {
        Api: "Departments",
        componentViwe: PlaceholderPage,
        componentAddEdit: PlaceholderPage,
        keyId: "id",
    },
    Settings: {
        Api: "Settings",
        componentViwe: PlaceholderPage,
        componentAddEdit: PlaceholderPage,
        keyId: "id",
    },
    Vendors: {
        Api: "Vendors",
        componentViwe: Vendors,
        componentAddEdit: VendorsAddEdit,
        keyId: "recId",
        isSelected: true,
        ...VendorsGrid,
        ...VendorsFilter,
        ...VendorsActions,
        formSchema: VendorsForm // <--- Added Form Schema
    }
};