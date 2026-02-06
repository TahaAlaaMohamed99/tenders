# Unused & Partially Used Code

## Overview

This document identifies unused components, hooks, config entries, and dead code that should be removed, documented, or implemented.

---

## 1. Unused Components

### 1.1 DynamicPlaceholder.jsx

**Location**: `src/Components/DynamicPlaceholder.jsx` (56 lines)

**Purpose**: Dev debugging placeholder that displays schema config.

**Status**: ❌ Dead Code

**Evidence**: Not imported by any file.

**Grep Results**:
```bash
$ rg "import.*DynamicPlaceholder" --type tsx --type jsx
# 0 matches
```

**Recommendation**: **Remove**

**Reason**: Debugging component not needed in production.

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

**Location**: `src/utils/Config.jsx` (27 lines)

**Purpose**: Vite environment variable wrapper.

**Status**: ❌ Dead Code

**Evidence**: Not imported by any file.

**Recommendation**: **Remove**

**Reason**: Replaced by `Ip_config.json` runtime configuration. See `04-configuration.md` for details.

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

**Location**: `src/utils/useFromLocalStorage.jsx` (line 38)

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
- `useFormatDate.jsx` → Should be `formatDate.js`
- `useFormatNumber.jsx` → Should be `formatNumber.js`
- `useFormatTime.jsx` → Should be `formatTime.js`
- `useFormateDataPrint.jsx` → Should be `formatDataPrint.js`
- `useformatDataGrid.jsx` → Should be `formatDataGrid.js`
- `useFromLocalStorage.jsx` → Should be `storage.js`

**Status**: ⚠️ Misleading Naming

**Impact**: Medium
- Violates React Hook naming convention
- Triggers ESLint warnings
- Confuses developers

**Recommendation**: **Rename Files**

**Fix**:
```bash
mv src/utils/useFormatDate.jsx src/utils/formatDate.js
mv src/utils/useFormatNumber.jsx src/utils/formatNumber.js
mv src/utils/useFormatTime.jsx src/utils/formatTime.js
mv src/utils/useFormateDataPrint.jsx src/utils/formatDataPrint.js
mv src/utils/useformatDataGrid.jsx src/utils/formatDataGrid.js
mv src/utils/useFromLocalStorage.jsx src/utils/storage.js
```

**Then update all imports**:
```javascript
// Before:
import useFormatDate from './utils/useFormatDate';

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
| `getLocalStorageAll()` missing return | `useFromLocalStorage.jsx:38` | Low (unused) | P3 |
| `ModaRemoveBookmark` props mismatch | `ModaRemoveBookmark.jsx:15` | Medium (broken feature) | P2 |
| `signalRService.sendNotification()` missing | `signalRService.jsx` | Low (stub) | P3 |

---

### Naming Violations

| File | Issue | Recommendation | Priority |
|------|-------|----------------|----------|
| `useFormatDate.jsx` | Non-hook with "use" prefix | Rename to `formatDate.js` | P3 |
| `useFormatNumber.jsx` | Non-hook with "use" prefix | Rename to `formatNumber.js` | P3 |
| `useFormatTime.jsx` | Non-hook with "use" prefix | Rename to `formatTime.js` | P3 |
| `useFormateDataPrint.jsx` | Non-hook with "use" prefix | Rename to `formatDataPrint.js` | P3 |
| `useformatDataGrid.jsx` | Non-hook with "use" prefix | Rename to `formatDataGrid.js` | P3 |
| `useFromLocalStorage.jsx` | Non-hook with "use" prefix | Rename to `storage.js` | P3 |

---

## Cleanup Checklist

### High Priority (P2)

- [ ] Fix `ModaRemoveBookmark` props mismatch
- [ ] Add fallback to `useConfig` for missing `Ip_config.json`
- [ ] Add error handling to `DynamicForm` for missing components

### Low Priority (P3)

- [ ] Remove `DynamicPlaceholder.jsx`
- [ ] Remove `useCurrencyOptions.jsx`
- [ ] Remove `utils/Config.jsx`
- [ ] Remove `dummyData.json` import from `useGridData.jsx`
- [ ] Remove or implement `FilterSchemas.jsx`
- [ ] Remove or implement `ActionSchemas.jsx`
- [ ] Remove or implement `DataPagesHierarchyGrid.jsx` + `HierarchyAll.jsx`
- [ ] Remove `restructureModules` export from `useProcessMenu.jsx`
- [ ] Remove `getPrevRouteStatic` export from `useRouteMemory.jsx`
- [ ] Fix `getLocalStorageAll()` missing return or remove if unused
- [ ] Rename `use`-prefixed utils to remove `use` prefix
- [ ] Implement or remove `ViewerRec.jsx`
- [ ] Implement or remove `signalRService.jsx` calls

---

## Estimated Impact

**Total Lines to Remove**: ~300 lines (dead code + unused imports)

**Total Files to Remove**: 5 files
- `DynamicPlaceholder.jsx`
- `useCurrencyOptions.jsx`
- `utils/Config.jsx`
- `FilterSchemas.jsx` (if not implementing)
- `ActionSchemas.jsx` (if not implementing)

**Total Files to Rename**: 6 files (utils with wrong naming)

**Total Bugs to Fix**: 3 bugs
- `ModaRemoveBookmark` props
- `getLocalStorageAll()` return
- `useConfig` fallback

---

## Recommendations

1. **Run cleanup sprint**: Dedicate 1-2 days to remove dead code
2. **Add linting rules**: Prevent future dead code accumulation
3. **Document stubs**: Add clear comments for stub implementations
4. **Add validation**: Validate metadata schemas at runtime
5. **Run dependency audit**: Use `depcheck` to find unused npm packages
