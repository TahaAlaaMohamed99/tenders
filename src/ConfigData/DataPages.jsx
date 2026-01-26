import Vendors from "../Pages/Vendors";
import VendorsAddEdit from "../Pages/VendorsAddEdit";

export const DataPages = {
    Vendors: {
        Api: "Vendors",
        componentViwe: <Vendors />,
        componentAddEdit: <VendorsAddEdit />,
        keyId: "recId",
        isSelected: true,
        columns: [
            {
                key: "personalNumber",
                title: "personalNumber",
                fixed: true,
                width: 150,
                maxWidth: 180,
                minwidth: 100
            },
            {
                key: "employeeRecFullName",
                title: "fullName",
                fixed: true,
                ModalContent: true,
                width: 200,
                maxWidth: 220,
                isFilter: true,
                "isFilterSelect": true
            },
            {
                key: "fromDate",
                title: "fromDate",
                ResourcePage: "GeneralField",
                width: 150,
                maxWidth: 180,
                ModalContent: true,
                type: "date",
                isFilter: true
            },
            {
                key: "toDate",
                title: "toDate",
                ResourcePage: "GeneralField",
                width: 150,
                maxWidth: 180,
                ModalContent: true,
                type: "date",
                isFilter: true
            },
            {
                key: "statusName",
                title: "titleGrid",
                generallist: "WorkflowStatus",
                width: 150,
                maxWidth: 200,
                secondKey: "status",
                 type: "status",
                isFilter: true
            },
            {
                key: "jobName",
                title: "jobName",
                width: 250,
                maxWidth: 350
            },
            {
                key: "departmentName",
                title: "departmentName",
                ResourcePage: "Department",
                width: 250,
                maxWidth: 350
            },
            {
                key: "employeeRecGenderName",
                title: "titleGrid",
                generallist: "Gender",
                width: 150,
                maxWidth: 200,
                secondKey: "employeeRecGender",
                StatusList: {
                    "1": "state_Primary",
                    "2": "state_Error"
                },
                type: "status",
                isFilter: true
            },
            {
                key: "vacationCategoryName",
                title: "vacationCategoryName",
                width: 250,
                maxWidth: 350,
                type: "status"
            },
            {
                key: "balanceOpening",
                title: "balanceOpening",
                width: 160,
                maxWidth: 200
            },
            {
                key: "balance",
                title: "balance",
                width: 160,
                maxWidth: 200
            },
            {
                key: "balanceTimes",
                title: "balanceTimes",
                width: 160,
                maxWidth: 200
            },
            {
                key: "remainder",
                title: "remainder",
                width: 160,
                maxWidth: 200
            },
            {
                key: "remainderOpening",
                title: "remainderOpening",
                width: 160,
                maxWidth: 200
            },
            {
                key: "totalDuration",
                title: "totalDuration",
                hiddenMobile: true,
                width: 200,
                maxWidth: 240
            },
            {
                key: "createdOn",
                title: "createdOn",
                hiddenMobile: true,
                width: 150,
                maxWidth: 180,
                type: "date"
            },
            {
                key: "createdByUser",
                title: "createdByUser",
                hiddenMobile: true,
                width: 200,
                maxWidth: 240,
                type: "status",
                className: "state_Primary"
            },
            {
                key: "modifiedOn",
                title: "modifiedOn",
                hiddenMobile: true,
                width: 150,
                maxWidth: 180,
                type: "date"
            },
            {
                key: "modifiedByUser",
                title: "modifiedByUser",
                hiddenMobile: true,
                width: 200,
                maxWidth: 240,
                type: "status",
                className: "state_Success"
            }
        ]
    }
};