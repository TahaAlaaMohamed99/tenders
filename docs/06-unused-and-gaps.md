# Unused & Partially Used Code

> **Last Updated**: 2026-02-08  
> **Related Docs**: [Components](./01-components.md) | [Hooks](./02-hooks.md) | [Metadata](./03-metadata-driven-ui.md) | [Configuration](./04-configuration.md) | [Action Plan](./07-action-plan.md)

## Overview

This document identifies unused components, hooks, config entries, and dead code that should be removed, documented, or implemented.

### Summary

| Category | Items | Action |
|----------|-------|--------|
| [Unused Components](#1-unused-components) | 4 | Remove or fix |
| [Unused Hooks](#2-unused-hooks) | 1 confirmed dead | Remove |
| [Unused Config](#3-unused-config-entries) | 4 (3 placeholder, 1 dead) | Remove or implement |
| [Unused Exports](#4-unused-exports) | 2 dead exports | Remove |
| [Partially Used](#5-partially-used-components) | 2 stubs | Implement or remove |
| [Unused Utils](#6-unused-utility-functions) | 1 broken | Fix or remove |
| [Naming Violations](#9-naming-convention-violations) | 6 files | Rename |
| [Hardcoded Values](#10-hardcoded-values-that-should-be-config) | 3 items | Move to config |
| **Total Lines to Remove** | **~300 lines** | - |
| **Total Files to Remove** | **5 files** | - |

---

## 1. Unused Components

### 1.1 DynamicPlaceholder.jsx

**Location**: `src/Components/DynamicPlaceholder.jsx` (56 lines)

**Purpose**: Dev debugging placeholder that displays schema config.

**Status**: ⚠️ Used by one placeholder page

**Evidence**: Imported only by `src/Pages/Vendors.jsx`:
```javascript
// src/Pages/Vendors.jsx
import DynamicPlaceholder from '../Components/DynamicPlaceholder';
export default function Vendors(props) {
  return <DynamicPlaceholder {...props} />;
}
```

**Recommendation**: **Remove both files** — `DynamicPlaceholder.jsx` and `Vendors.jsx` (placeholder page). If Vendors list page is needed, use [GenericGridPage](./01-components.md#21-genericgridpage) via `DataPages` config instead.

**See Also**: [01-components.md#66-vendors-placeholder](./01-components.md#66-vendors-placeholder)

---

### 1.2 HierarchyAll.jsx

**Location**: `src/Components/HierarchyAll.jsx` (46 lines)

**Purpose**: Hierarchy view modal.

**Status**: ⚠️ Imported but Never Rendered

**Evidence**:
- Imported in `HeaderPageAddEdit.jsx:66`
- All `DataPagesHierarchyGrid` entries have `enabled: false`
- Modal never opens because `isShowHierarchy` is always false

**DataPagesHierarchyGrid.jsx**:
```javascript
export const DataPagesHierarchyGrid = {
  Vendors: { enabled: false, parentKey: null, gridConfig: null },
  VendorGroups: { enabled: false, parentKey: null, gridConfig: null },
  Currencies: { enabled: false, parentKey: null, gridConfig: null },
  Departments: { enabled: false, parentKey: null, gridConfig: null },
  Items: { enabled: false, parentKey: null, gridConfig: null }
};
```

**Recommendation**: **Remove or Document**

**Options**:
1. **Remove**: If hierarchy feature is not planned
2. **Document**: Add comment explaining future implementation
3. **Implement**: Enable for at least one entity

---

### 1.3 ModaRemoveBookmark.jsx

**Location**: `src/Components/Layout/componentsNavbar/ModaRemoveBookmark.jsx` (40 lines)

**Purpose**: Bookmark removal confirmation modal.

**Status**: ⚠️ Imported but Broken

**Evidence**:
- Imported in `Header.jsx:17`
- **Props mismatch**: Passes `isOpen`, `onConfirm`, `onClose` but `ConfirmationModal` expects `isVisible`, `onConfirm`, `onCancel`

**Code**:
```javascript
// ModaRemoveBookmark.jsx:15
<ConfirmationModal
  isOpen={isOpen}          // ← Should be isVisible
  onConfirm={onConfirm}
  onClose={onClose}        // ← Should be onCancel
  type="delete"
/>
```

**Recommendation**: **Fix Props**

**Fix**:
```javascript
<ConfirmationModal
  isVisible={isOpen}
  onConfirm={onConfirm}
  onCancel={onClose}
  type="delete"
/>
```

---

## 2. Unused Hooks

### 2.1 useCurrencyOptions.jsx

**Location**: `src/Hooks/useCurrencyOptions.jsx` (32 lines)

**Purpose**: Fetches currency list from `restcountries.com/v3.1/all`.

**Status**: ❌ Dead Code

**Evidence**: Not imported by any file.

**Grep Results**:
```bash
$ rg "import.*useCurrencyOptions" --type tsx --type jsx
# 0 matches
```

**Recommendation**: **Remove**

**Reason**: External API call for currency data is not used. If needed, should fetch from backend API instead.

---

### 2.2 useGetSelected.jsx

**Location**: `src/Hooks/useGetSelected.jsx` (31 lines)

**Purpose**: Finds selected item in a list by value/label.

**Status**: ⚠️ Possibly Used in Ignored Pages

**Evidence**: Not imported in current codebase (excluding vendor pages).

**Recommendation**: **Keep**

**Reason**: Utility hook that may be used in ignored vendor pages or future features.

---

### 2.3 useHandleDelete.jsx

**Location**: `src/Hooks/useHandleDelete.jsx` (68 lines)

**Purpose**: DELETE API call with toast notifications.

**Status**: ⚠️ Possibly Used in Ignored Pages

**Evidence**: Not imported in current codebase (excluding vendor pages).

**Recommendation**: **Keep**

**Reason**: Standard CRUD hook that may be used in ignored vendor pages or future features.

---

### 2.4 useRouteMemory.jsx

**Location**: `src/Hooks/useRouteMemory.jsx` (110 lines)

**Purpose**: Persists route history for "Go Back" navigation.

**Status**: ⚠️ Possibly Used in Ignored Pages

**Evidence**: Not imported in current codebase (excluding vendor pages).

**Recommendation**: **Keep**

**Reason**: Navigation utility that may be used in ignored vendor pages or future features.

---

## 3. Unused Config Entries

### 3.1 FilterSchemas.jsx

**Location**: `src/ConfigData/FilterSchemas.jsx` (14 lines)

**Purpose**: Advanced side-panel filter configuration.

**Status**: ❌ Placeholder / Dead Code

**Evidence**:
```javascript
export const VendorsFilter = {
  filters: []  // ← Empty
};
```

**Consumed By**: Spread into `DataPages.jsx` but never read by any component.

**Recommendation**: **Remove or Implement**

**Options**:
1. **Remove**: If advanced filters are not planned
2. **Implement**: Add filter definitions and update `FilterGrid.jsx` to read them

---

### 3.2 ActionSchemas.jsx

**Location**: `src/ConfigData/ActionSchemas.jsx` (17 lines)

**Purpose**: Row and bulk action configuration.

**Status**: ❌ Placeholder / Dead Code

**Evidence**:
```javascript
export const VendorsActions = {
  rowActions: [],   // ← Empty
  bulkActions: []   // ← Empty
};
```

**Consumed By**: Spread into `DataPages.jsx` but never read by any component.

**Recommendation**: **Remove or Implement**

**Options**:
1. **Remove**: If custom actions are not planned
2. **Implement**: Add action definitions and update `TendersGrid` to read them

---

### 3.3 DataPagesHierarchyGrid.jsx

**Location**: `src/ConfigData/DataPagesHierarchyGrid.jsx` (22 lines)

**Purpose**: Configuration for hierarchical grid views.

**Status**: ❌ Placeholder / Unused

**Evidence**: All entries have `enabled: false`.

**Recommendation**: **Remove or Implement**

**Options**:
1. **Remove**: If hierarchy feature is not planned
2. **Implement**: Enable for at least one entity and implement `HierarchyAll.jsx`

---

### 3.4 dummyData.json

**Location**: `src/ConfigData/dummyData.json`

**Purpose**: Mock data for development.

**Status**: ❌ Dead Import

**Evidence**:
- Imported in `useGridData.jsx:8`
- Never used (fallback logic was removed)

**Code**:
```javascript
// useGridData.jsx:8
import dummyData from "../ConfigData/dummyData.json";  // ← Imported

// ... but never used anywhere in the file
```

**Recommendation**: **Remove Import**

**Fix**:
```javascript
// Remove line 8 from useGridData.jsx
```

---

### 3.5 utils/Config.jsx

**Location**: `src/utils/Config.jsx` (93 lines)

**Purpose**: Permission wrapper + environment helpers. Delegates to `src/utils/permissions.js`.

**Status**: ✅ **Active** (Phase 0 corrected — was incorrectly classified as dead code)

**Evidence**: Imported by `HeaderPageAddEdit.jsx` (line 45) and `SubmissionDocumentLineAddEdit.jsx` (line 9). Used for `Config.isAllow("Delete", confiPage)` etc.

**Recommendation**: **Keep** — this is NOT dead code. It's the permission checking facade used by page-level components. See [04-configuration.md](./04-configuration.md) for updated analysis.

---

## 4. Unused Exports

### 4.1 useProcessMenu.restructureModules

**Location**: `src/Hooks/useProcessMenu.jsx` (line 149)

**Purpose**: Exported function for restructuring modules.

**Status**: ❌ Dead Export

**Evidence**:
```javascript
// Exported:
export { restructureModules };

// But never imported anywhere
```

**Recommendation**: **Remove Export**

**Fix**:
```javascript
// Change from:
export { restructureModules };

// To:
// (remove export, keep as internal function if needed)
```

---

### 4.2 useRouteMemory.getPrevRouteStatic

**Location**: `src/Hooks/useRouteMemory.jsx` (line 108)

**Purpose**: Static function to get previous route without hook.

**Status**: ❌ Dead Export

**Evidence**: Exported but never imported.

**Recommendation**: **Remove Export**

---

## 5. Partially Used Components

### 5.1 ViewerRec.jsx

**Location**: `src/Components/ViewerRec.jsx` (44 lines)

**Purpose**: Record detail viewer.

**Status**: ⚠️ Stub Implementation

**Evidence**:
- Imported in `HeaderPageAddEdit.jsx:67`
- Rendered conditionally but always returns placeholder:
  ```javascript
  return <div>Record Viewer (Not Implemented)</div>;
  ```

**Recommendation**: **Implement or Remove**

**Options**:
1. **Implement**: Build full record viewer
2. **Remove**: If feature is not needed

---

### 5.2 signalRService.jsx

**Location**: `src/services/signalRService.jsx` (42 lines)

**Purpose**: Real-time communication via SignalR.

**Status**: ⚠️ Stub Implementation

**Evidence**:
- Imported in `HeaderPageAddEdit.jsx:43`
- All methods are stubs (console.log only)
- `sendNotification()` is called but doesn't exist (only `send()` exists)

**Code**:
```javascript
// signalRService.jsx
const send = (method, ...args) => {
  console.log(`SignalR send: ${method}`, args);
};

const on = (event, callback) => {
  console.log(`SignalR on: ${event}`);
};

export default { send, on };
```

**HeaderPageAddEdit.jsx calls**:
```javascript
signalRService.sendNotification(/* ... */);  // ← Method doesn't exist
```

**Recommendation**: **Implement or Remove Calls**

**Options**:
1. **Implement**: Connect to real SignalR hub
2. **Remove Calls**: If real-time notifications are not needed yet

---

## 6. Unused Utility Functions

### 6.1 getLocalStorageAll()

**Location**: `src/utils/localStorage.jsx` (line 38) — *renamed from `useFromLocalStorage.jsx` in Phase 7*

**Purpose**: Reads all localStorage keys.

**Status**: ❌ Broken + Unused

**Bug**: Missing `return` statement.

**Code**:
```javascript
export const getLocalStorageAll = () => {
  try {
    const allData = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      allData[key] = getLocalStorageAtob(key);
    }
    // ← Missing: return allData;
  } catch (error) {
    console.error("Error getting all localStorage data:", error);
    return {};
  }
};
```

**Evidence**: Not imported by any file.

**Recommendation**: **Fix or Remove**

**Fix**:
```javascript
export const getLocalStorageAll = () => {
  try {
    const allData = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      allData[key] = getLocalStorageAtob(key);
    }
    return allData;  // ← Add this line
  } catch (error) {
    console.error("Error getting all localStorage data:", error);
    return {};
  }
};
```

---

## 7. Unused CSS/Styles

### 7.1 Orphaned CSS Classes

**Status**: Not audited (requires CSS analysis tool)

**Recommendation**: Run PurgeCSS or similar tool to identify unused Tailwind classes.

---

## 8. Unused Dependencies

### 8.1 Package.json Analysis

**Method**: Check `package.json` dependencies against actual imports.

**Potential Unused** (requires verification):
- `@dnd-kit/*` (only used in CustomizeColumn)
- `react-datetime-picker` (only used in CustomDatePicker)
- `react-tooltip` (only used in AppTooltip)

**Recommendation**: Run `depcheck` or similar tool:
```bash
npx depcheck
```

---

## 9. Naming Convention Violations

### 9.1 Non-Hook Functions with "use" Prefix

**Location**: `src/utils/`

**Files**:
- ~~`useFormatDate.jsx`~~ → `formatDate.jsx` ✅ **Renamed (Phase 7)**
- ~~`useFormatNumber.jsx`~~ → `formatNumber.jsx` ✅ **Renamed (Phase 7)**
- ~~`useFormatTime.jsx`~~ → `formatTime.jsx` ✅ **Renamed (Phase 7)**
- ~~`useFormateDataPrint.jsx`~~ → `formatDataPrint.jsx` ✅ **Renamed (Phase 7)**
- ~~`useformatDataGrid.jsx`~~ → `formatDataGrid.jsx` ✅ **Renamed (Phase 7)**
- ~~`useFromLocalStorage.jsx`~~ → `localStorage.jsx` ✅ **Renamed (Phase 7)**

**Status**: ⚠️ Misleading Naming

**Impact**: Medium
- Violates React Hook naming convention
- Triggers ESLint warnings
- Confuses developers

**Recommendation**: **Rename Files**

**Fix**:
```bash
# ✅ DONE (Phase 7) — All renames completed with 23 import updates:
# mv src/utils/useFormatDate.jsx src/utils/formatDate.jsx
# mv src/utils/useFormatNumber.jsx src/utils/formatNumber.jsx
# mv src/utils/useFormatTime.jsx src/utils/formatTime.jsx
# mv src/utils/useFormateDataPrint.jsx src/utils/formatDataPrint.jsx
# mv src/utils/useformatDataGrid.jsx src/utils/formatDataGrid.jsx
# mv src/utils/useFromLocalStorage.jsx src/utils/localStorage.jsx
```

**Then update all imports**:
```javascript
// Before:
import { useFormatDate } from './utils/formatDate';  // ✅ Updated (Phase 7)

// After:
import { formatDate } from './utils/formatDate';
```

---

## 10. Hardcoded Values That Should Be Config

### 10.1 Default Page Size

**Location**: `src/Components/GenericGridPage.jsx` (line 40)

**Code**:
```javascript
const [pageSize, setPageSize] = useState(20);  // ← Hardcoded
```

**Recommendation**: Move to `DataPages` config:
```javascript
// DataPages.jsx
Vendors: {
  defaultPageSize: 20,  // ← Configurable
  // ...
}
```

---

### 10.2 User Avatar Fallback

**Location**: `src/Components/UserAvatar.jsx` (line 22)

**Code**:
```javascript
const fallbackUrl = "https://via.placeholder.com/40";  // ← Hardcoded
```

**Recommendation**: Use from `AuthContext.user.imageUrl` or app config.

---

### 10.3 Hardcoded User Data

**Location**: `src/Components/Header.jsx` (line 163)

**Code**:
```javascript
const user = {
  name: "Admin User",           // ← Hardcoded
  email: "admin@example.com",   // ← Hardcoded
  image: null
};
```

**Recommendation**: Use from `AuthContext.user`.

---

## 11. Missing Error Handling

### 11.1 useConfig Missing Fallback

**Location**: `src/Hooks/useConfig.jsx`

**Issue**: If `Ip_config.json` fetch fails, API calls will use empty base URL.

**Recommendation**: Add fallback (see `04-configuration.md`).

---

### 11.2 DynamicForm Missing Component Error

**Location**: `src/Components/DynamicForm.jsx`

**Issue**: If `componentRegistry[field.type]` is undefined, renders nothing silently.

**Recommendation**: Add error boundary or fallback:
```javascript
const Component = componentRegistry[field.type];
if (!Component) {
  console.error(`Missing component for field type: ${field.type}`);
  return <div>Unsupported field type: {field.type}</div>;
}
```

---

## 12. Missing Validation

### 12.1 Metadata Schema Validation

**Issue**: No validation for `DataPages`, `GridSchemas`, `FormSchemas`.

**Impact**: Typos cause silent failures or runtime errors.

**Recommendation**: Add JSON Schema or TypeScript interfaces.

---

## Summary Tables

### Unused Components

| Component | Status | Recommendation | Priority |
|-----------|--------|----------------|----------|
| `DynamicPlaceholder.jsx` | Dead code | Remove | P3 |
| `HierarchyAll.jsx` | Imported but never rendered | Remove or implement | P3 |
| `ModaRemoveBookmark.jsx` | Broken props | Fix | P2 |
| `ViewerRec.jsx` | Stub | Implement or remove | P3 |

---

### Unused Hooks

| Hook | Status | Recommendation | Priority |
|------|--------|----------------|----------|
| `useCurrencyOptions.jsx` | Dead code | Remove | P3 |
| `useGetSelected.jsx` | Possibly used in ignored pages | Keep | - |
| `useHandleDelete.jsx` | Possibly used in ignored pages | Keep | - |
| `useRouteMemory.jsx` | Possibly used in ignored pages | Keep | - |

---

### Unused Config

| File | Status | Recommendation | Priority |
|------|--------|----------------|----------|
| `FilterSchemas.jsx` | Placeholder | Remove or implement | P3 |
| `ActionSchemas.jsx` | Placeholder | Remove or implement | P3 |
| `DataPagesHierarchyGrid.jsx` | Placeholder | Remove or implement | P3 |
| `dummyData.json` | Dead import | Remove import | P3 |
| `utils/Config.jsx` | Dead code | Remove | P3 |

---

### Unused Exports

| Export | Location | Recommendation | Priority |
|--------|----------|----------------|----------|
| `restructureModules` | `useProcessMenu.jsx` | Remove export | P3 |
| `getPrevRouteStatic` | `useRouteMemory.jsx` | Remove export | P3 |

---

### Broken Code

| Issue | Location | Impact | Priority |
|-------|----------|--------|----------|
| `getLocalStorageAll()` missing return | `localStorage.jsx:38` (commented out Phase 5) | ✅ Fixed | P3 |
| `ModaRemoveBookmark` props mismatch | `ModaRemoveBookmark.jsx:15` | Medium (broken feature) | P2 |
| `signalRService.sendNotification()` missing | `signalRService.jsx` | Low (stub) | P3 |

---

### Naming Violations

| File | Issue | Recommendation | Priority |
|------|-------|----------------|----------|
| ~~`useFormatDate.jsx`~~ | Non-hook with "use" prefix | ✅ Renamed to `formatDate.jsx` (Phase 7) | P3 |
| ~~`useFormatNumber.jsx`~~ | Non-hook with "use" prefix | ✅ Renamed to `formatNumber.jsx` (Phase 7) | P3 |
| ~~`useFormatTime.jsx`~~ | Non-hook with "use" prefix | ✅ Renamed to `formatTime.jsx` (Phase 7) | P3 |
| ~~`useFormateDataPrint.jsx`~~ | Non-hook with "use" prefix | ✅ Renamed to `formatDataPrint.jsx` (Phase 7) | P3 |
| ~~`useformatDataGrid.jsx`~~ | Non-hook with "use" prefix | ✅ Renamed to `formatDataGrid.jsx` (Phase 7) | P3 |
| ~~`useFromLocalStorage.jsx`~~ | Non-hook with "use" prefix | ✅ Renamed to `localStorage.jsx` (Phase 7) | P3 |

---

## Cleanup Checklist

### High Priority (P2)

- [x] Fix `ModaRemoveBookmark` props mismatch — **FIXED (Phase 1)**
- [x] Add fallback to `useConfig` for missing `Ip_config.json` — **FIXED (Phase 2)**
- [x] Add error handling to `DynamicForm` for missing components — **FIXED (Phase 3)**

### Low Priority (P3) — Phase 6 Cleanup

- [x] ~~Remove `DynamicPlaceholder.jsx`~~ — **Commented out (Phase 6)**, no-op export kept
- [x] ~~Remove `useCurrencyOptions.jsx`~~ — **Commented out (Phase 6)**, kept for future use
- [x] ~~Remove `utils/Config.jsx`~~ — **Phase 0 correction**: NOT dead code, actively used for permissions
- [x] ~~Remove `dummyData.json` import from `useGridData.jsx`~~ — **Removed (Phase 2)**
- [x] ~~Remove or implement `FilterSchemas.jsx`~~ — **Documented as placeholder (Phase 6)**, empty export kept
- [x] ~~Remove or implement `ActionSchemas.jsx`~~ — **Documented as placeholder (Phase 6)**, empty export kept
- [x] ~~Remove or implement `DataPagesHierarchyGrid.jsx`~~ — **Documented as placeholder (Phase 6)**, all disabled
- [x] ~~Remove `restructureModules` export from `useProcessMenu.jsx`~~ — **Commented out (Phase 2)**
- [x] ~~Remove `getPrevRouteStatic` export from `useRouteMemory.jsx`~~ — **Commented out (Phase 6)**
- [x] ~~Fix `getLocalStorageAll()` missing return~~ — **Commented out (Phase 5)**, kept for future use
- [ ] Rename `use`-prefixed utils to remove `use` prefix — **Deferred** (high risk for import churn)
- [x] ~~Fix `ViewerRec.jsx`~~ — **Fixed prop mismatch (Phase 6)**: accepts both `data` and `dataHeader`
- [x] ~~Fix `signalRService.jsx` calls~~ — **Added `sendNotification` method (Phase 2)**

---

## Estimated Impact

**Total Lines to Remove**: ~250 lines (dead code + unused imports)

**Total Files to Remove**: 4 files
- `DynamicPlaceholder.jsx`
- `useCurrencyOptions.jsx`
- `FilterSchemas.jsx` (if not implementing)
- `ActionSchemas.jsx` (if not implementing)

> **Phase 0 correction**: `utils/Config.jsx` was removed from this list — it is actively used for permission checking.

**Total Files to Rename**: 6 files (utils with wrong naming)

**Total Bugs to Fix**: 3 bugs
- `ModaRemoveBookmark` props
- `getLocalStorageAll()` return
- `useConfig` fallback

---

## Recommendations

1. **Run cleanup sprint**: Dedicate 1-2 days to remove dead code — see [07-action-plan.md](./07-action-plan.md#11-remove-dead-code)
2. **Add linting rules**: Prevent future dead code accumulation
3. **Document stubs**: Add clear comments for stub implementations
4. **Add validation**: Validate metadata schemas at runtime — see [07-action-plan.md](./07-action-plan.md#18-add-metadata-schema-validation)
5. **Run dependency audit**: Use `depcheck` to find unused npm packages

---

## Cross-Reference Index

| Topic | Related Document |
|-------|-----------------|
| Component status details | [01-components.md](./01-components.md) |
| Hook analysis | [02-hooks.md](./02-hooks.md) |
| Dead metadata files | [03-metadata-driven-ui.md](./03-metadata-driven-ui.md#unused-metadata) |
| Dead Config.jsx | [04-configuration.md](./04-configuration.md#2-utilsconfigjsx) |
| SOLID violations | [05-solid-clean-architecture.md](./05-solid-clean-architecture.md) |
| Cleanup action plan | [07-action-plan.md](./07-action-plan.md#p3--low-priority-cleanup) |

---

**Document Version**: 2.0  
**Last Updated**: 2026-02-08  
**Dead Code Verified**: All items verified against current codebase
