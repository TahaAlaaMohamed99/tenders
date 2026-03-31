# Security Management Guide

This document provides a detailed overview of the system's security management components, including their roles, logic, and how to use them within the codebase.

## 1. Overview
The security module is designed to provide granular control over user access through a combination of Roles and Permissions. It operates on a metadata-driven architecture, where permissions are defined at the Module, Sub-Module, and Page levels.

## 2. Key Components

### 2.1 PermissionsLog
- **Location**: `src/Components/PermissionsLog/index.jsx`
- **Role**: The core interface for assigned permissions. It renders a matrix where rows are pages/actions and columns are selection states.
- **Logic**: 
  - Fetches all system permissions via `Permission/GetAllPermissions`.
  - Uses the `usePermissionSelection` hook to manage hierarchical toggling.
  - Supports bulk selection (Select All, Select Module, Select Page).
- **Benefit**: Centralizes permission auditing and assignment in a single, intuitive interface.

### 2.2 UsersAddEdit
- **Location**: `src/Pages/Users/UsersAddEdit.jsx`
- **Role**: A multi-step stepper for user management.
- **Steps**:
  1. **User Profile**: Basic identity and credentials.
  2. **Role Mapping**: Associating the user with one or more system roles.
  3. **Permission Overrides**: Directly assigning specific permissions to a user (overriding roles).
  4. **Employee Link**: Linking the user to a physical employee record.
- **Benefit**: Simplifies the administrative burden of onboarding new users with complex access needs. Uses [DynamicForm](./01-components.md#24-dynamicform) for Step 0 (Phase 2).

### 2.3 RolesAddEdit
- **Location**: `src/Pages/Roles/RolesAddEdit.jsx`
- **Role**: Manages role definitions and their base permissions.
- **Logic**: Combines basic role metadata (name, code) with the `PermissionsLog` component for permission assignment.
- **Benefit**: Ensures consistency across groups of users by defining standard access levels.
- **RolesAddEditLine**: A specialized popup modal for quick role assignment, refactored to use [DynamicForm](./01-components.md#24-dynamicform) (Phase 2).

---

## 3. How to Use & Extend

### Adding Permissions to a New Page
1. Ensure the page is defined in `DataPages.jsx`.
2. Add a `KeyPermission` to the page configuration (e.g., `KeyPermission: "MyNewFeature"`).
3. The system will automatically detect this and include it in the `PermissionsLog` hierarchy under the corresponding module.

### Programmatic Permission Checks
Use the `Config.isAllow()` utility to check permissions in components:
```javascript
import Config from "../../utils/Config";

const MyComponent = ({ ConfiMainPage }) => {
  const canModify = Config.isAllow("Modify", ConfiMainPage);
  
  return (
    <div>
      {canModify && <button>Edit Content</button>}
    </div>
  );
};
```

---

## 4. Refactoring the PermissionsLog (SRP)

### The Problem
The original `PermissionsLog` component was over 800 lines long and handled:
- UI Rendering (Matrix, Accordions).
- Data Fetching.
- **Selection Math**: Complex logic for "Select All" at module/page levels was deeply nested within the component.
- **Count Calculations**: Recursive logic to show "Selected: X/Y" for each module.

### The Solution: `usePermissionSelection`
We extracted all selection and counting logic into a dedicated hook: `src/Hooks/usePermissionSelection.jsx`.

**Actions taken to reduce complexity**:
1. **Isolated State**: The hook manages `selectPermissions` and `originalPermissions` independently.
2. **Simplified Recursive Toggles**: The complex loops for toggling entire modules were moved into the hook's `toggleAllModulesSelection` function.
3. **Pure Logic**: The component now simply calls hook methods (e.g., `selection.togglePage()`) instead of performing state-heavy calculations inside its render loop.

**Result**:
- `PermissionsLog.jsx` reduced from **840 → ~330 lines**.
- The component is now purely focused on **Rendering and Synchronization**, while the hook handles **Logic and Selection Math**.
