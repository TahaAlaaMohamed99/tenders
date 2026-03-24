# Users Module - Architectural Guide

The Users module is a multi-step entity management system that demonstrates the **Metadata-Driven UI** and **SOLID** principles of the Tenders application.

## Overview

The module consists of three main areas:
1.  **User Grid**: Listing all users.
2.  **Add/Edit User**: A stepper-based form for user details.
3.  **Permissions & Roles**: Integrated management of access control.

## Logic Flow (Step-by-Step)

### 1. User Listing (`Users/index`)
- Managed by `GenericGridPage`.
- Configuration is in [DataPages.jsx](file:///home/montaser/tenders/tenders/src/ConfigData/DataPages.jsx).
- Uses `Api: "User"` for fetching.

### 2. Add/Edit Stepper (`UsersAddEdit.jsx`)
The `UsersAddEdit` component handles the core logic across three steps:

#### Step 0: Data
- **Implementation**: Uses `DynamicForm`.
- **Schema**: `UsersForm` from [FormSchemas.jsx](file:///home/montaser/tenders/tenders/src/ConfigData/FormSchemas.jsx).
- **Data Handling**: Extracts data from standard or wrapped API responses (`data.data[0]`).
- **Refs (React 19)**: Form components now use standard `ref` props, removing the need for `forwardRef` and resolving performance warnings.
- **Styling**: Applies `view_only` class if `isAllowedModify` is false.
- **Layout Transition**: For new users (`id === 0`), the `Stepper` is bypassed, and the form is wrapped in a standard `px-4 py-6` container to match the top margin and padding of all other pages. This ensures a consistent professional spacing across the application.
- **Width Alignment**: The restrictive `form_editor` with fixed widths was removed, allowing the form to naturally occupy the full container width, matching the expansive layout of the "Edit" state.

#### Step 1: Assign Roles
- **Implementation**: Uses `GenericGridPageLine`.
- **Logic**: Fetches roles assigned to user via `User/GetRolesByUserId`.
- **Interaction**: Uses `RolesAddEditLine` for a popup modal to assign new roles.
- **DIP**: Uses metadata for the popup form as well.

#### Step 2: Permissions
- **Logic**: Hierarchical view (Area -> Module -> Table) of all permissions.
- **State**: Tracks "Granted" status for each permission for this specific user.
- **Conditional Visibility**: In the "Add" state (`id === 0`), this step is hidden to streamline the record creation flow.

## Permissions Logic

- **Access to Module**: Controlled via `Config.isAllow` in `DynamicRouter`.
- **Field-level Control**: `DynamicForm` respects `viewOnly` and `isDisabled` metadata.
- **Action Control**: Save/Edit buttons in `HeaderPageAddEdit` are disabled based on module permissions.

## Key Files
- [UsersAddEdit.jsx](file:///home/montaser/tenders/tenders/src/Pages/Users/UsersAddEdit.jsx): Orchestrator.
- [RolesAddEditLine.jsx](file:///home/montaser/tenders/tenders/src/Pages/Users/RolesAddEditLine.jsx): Role assignment popup.
- [FormSchemas.jsx](file:///home/montaser/tenders/tenders/src/ConfigData/FormSchemas.jsx): Field definitions.
- [useGridData.jsx](file:///home/montaser/tenders/tenders/src/Hooks/useGridData.jsx): Data fetching logic with pagination.
