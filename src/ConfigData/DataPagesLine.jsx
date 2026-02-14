import { CommonColumns } from "./CommonGridSchemas";
import { SubmissionDocumentsForm } from "./FormSchemas";

export const DataPagesLine = {
    SubmissionDocumentLine: {
        Api: "SubmissionDocumentLine",
        keyId: "recId",
        ExcelExport: true,
        isSearch: true,
        isFilterGrid: false,
        columns: [
            CommonColumns.ItemNumber,
            {
                key: "itemName",
                title: "itemName",
                width: 200,
                maxWidth: 280,
                isFilter: true
            },
            {
                key: "purchaseQuantity",
                title: "purchaseQuantity",
                width: 150,
                maxWidth: 200,
                isFilter: true
            },
            {
                key: "departmentName",
                title: "departmentName",
                width: 150,
                maxWidth: 200,
                isFilter: true
            },
            CommonColumns.CreatedOn
        ],
        formSchema: SubmissionDocumentsForm
    },
};