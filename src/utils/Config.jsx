import { getLocalStorageAtob } from "./localStorage";

class Config {
    /**
     * Checks if the user has the required permissions.
     *
     * @param {string[]} codes - An array of permission codes to check.
     * @param {boolean} [checkAll=false] - Whether to check if all codes are required (true) or any one code (false).
     * @returns {boolean} - Returns true if the user has the required permissions, otherwise false.
     */
    static isAllow(keyActions, ConfiPage, checkAll = false) {
        try {
            const userPermissions = getLocalStorageAtob("userPermissions", []);
            const permissionsSystem = getLocalStorageAtob("permissionsSystem", []);

            const actions = Array.isArray(keyActions) ? keyActions : [keyActions];

            const permissionNames = actions.map(
                (action) => ConfiPage.showMenu == "menuReportSetup"
                    ? `${ConfiPage?.KeyPermission || ConfiPage.keyPage}:${action}`:
                    ConfiPage.KeyPermission
                    ? `${ConfiPage.keyModule}:${ConfiPage.KeyPermission}:${action}`
                    : `${ConfiPage.keyModule}:${ConfiPage.subModule ? ConfiPage.subModule + ":" : ""}${ConfiPage.keyPage}:${action}`
            );
            const matchedIds = permissionNames
                .map((name) => {
                    const found = permissionsSystem.find((p) => p.name === name);
                    return found?.recId;
                })
                .filter(Boolean);
            const userIds = userPermissions.every(p => typeof p === 'object' && 'permissionRecId' in p)
                ? userPermissions.map(p => p.permissionRecId)
                : userPermissions;
            const isAllowed = checkAll
                ? matchedIds.every((id) => userIds.includes(id))
                : matchedIds.some((id) => userIds.includes(id));
            return isAllowed;
        } catch (error) {
            return false;
        }
    }
}

export default Config;
