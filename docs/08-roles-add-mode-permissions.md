# Roles & Permissions: Enabling Add-Mode Permissions

Currently, the application is configured to assign permissions **only in Edit Mode** (i.e. after a Role has been created). During Role creation (Add Mode), the permissions grid is intentionally hidden because the `PermissionsLog` component requires an existing `recId` to save permissions via the `Role/AssignOrRemovePermissionsToRole` endpoint.

If the backend team later decides to allow users to set permissions *while creating* a new role, you can implement it using the structured plan below without breaking the existing architecture.

## Implementation Guide

### 1. Update `src/Hooks/useHandleSubmit.jsx`
Modify the `handleSubmitFormik` function to pass the entire response (or at least the newly generated `recId`) back to the caller via the `onSuccess` callback. Currently, `onSuccess` is called without arguments:
```javascript
// Change this:
onSuccess?.();

// To this:
onSuccess?.(data); // `data` is the API response containing the new record ID
```

### 2. Update `src/Components/PermissionsLog/index.jsx`
The `PermissionsLog` component currently triggers an API call instantly when the user clicks "Save Changes". For Add Mode, it needs to delay saving until the Role is created.

1. **Expose Save Method:** In `PermissionsLog`, use `useImperativeHandle` with the `ref` prop to expose a `savePermissions(newRoleId)` function to the parent component.
2. **Handle Add Mode State:** Add an `isAddMode` boolean prop. If `isAddMode` is true:
   - Hide the internal "Save Changes" and "Cancel" buttons in the grid header.
   - Users can still check/uncheck boxes, modifying local state (`selectPermissions`).

### 3. Update `src/Pages/Roles/RolesAddEdit.jsx`
1. **Always Render Permissions:** Remove the conditional rendering `{id > 0 && ...}` so `PermissionsLog` is visible during Add Mode.
2. **Pass Props:** Pass `isAddMode={id === 0 || id === "0"}` to `PermissionsLog`.
3. **Attach a Ref:** Create a `permissionsLogRef = useRef()` and attach it to the `PermissionsLog` component.
4. **Trigger Save on Success:** In the `handleSubmit` function, utilize the updated `onSuccess` callback to capture the new Role ID and trigger the permissions save:
```javascript
const handleSubmit = (values) => {
  setIsLoadingSubmit(true);
  handleSubmitFormik({
    apiPage: ApiPage,
    values: values,
    recId: id,
    // ...other props
    onSuccess: (responseData) => {
      // If we are in Add mode, the backend just returned the new role's ID
      if (id === 0 || id === "0") {
          const newRoleId = responseData.data || responseData.recId;
          permissionsLogRef.current?.savePermissions(newRoleId);
      }
    }
  });
};
```

This ensures that the Role is successfully created first, and its permissions are appended immediately after without requiring the user to manually click "Edit" on the newly created role.
