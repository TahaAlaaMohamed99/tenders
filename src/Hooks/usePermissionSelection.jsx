import { useState, useEffect } from 'react';

/**
 * usePermissionSelection Hook
 * 
 * Manages the complex state and logic for selecting/deselecting permissions
 * in a hierarchical structure (Modules -> SubModules -> Pages -> Actions).
 * 
 * @param {Array} initialPermissions - Permissions already assigned
 * @param {Array} allPermissionsData - Complete list of available permissions from API
 */
export const usePermissionSelection = (initialPermissions, allPermissionsData) => {
    const [selectPermissions, setSelectPermissions] = useState([]);
    const [originalPermissions, setOriginalPermissions] = useState([]);

    useEffect(() => {
        if (initialPermissions) {
            setSelectPermissions(initialPermissions);
            setOriginalPermissions(initialPermissions);
        }
    }, [initialPermissions]);

    const togglePermission = (permission) => {
        if (!permission) return;
        const checked = selectPermissions.some(p => p.recId === permission.recId);
        setSelectPermissions(prev => 
            checked 
                ? prev.filter(p => p.recId !== permission.recId)
                : [...prev, permission]
        );
    };

    const getMatchedPermissions = (page, actions) => {
        if (!page || !actions || !allPermissionsData) return [];
        const pageKey = page.KeyPermission || page.keyPage;
        
        return actions.map(action => {
            return allPermissionsData.find(item => {
                if (!item.name) return false;
                const parts = item.name.split(":");
                let pk, act;
                if (parts.length === 4) { pk = parts[2]; act = parts[3]; }
                else if (parts.length === 3) { pk = parts[1]; act = parts[2]; }
                else { pk = parts[0]; act = parts[1]; }
                
                return pk === pageKey && act === action;
            });
        }).filter(Boolean);
    };

    const isPageFullySelected = (page, actions) => {
        const pagePerms = getMatchedPermissions(page, actions);
        return pagePerms.length > 0 && 
               pagePerms.every(perm => selectPermissions.some(p => p.recId === perm.recId));
    };

    const toggleSelectAllForPage = (page, actions) => {
        const pagePerms = getMatchedPermissions(page, actions);
        const allSelected = isPageFullySelected(page, actions);
        
        setSelectPermissions(prev => {
            if (allSelected) {
                return prev.filter(p => !pagePerms.some(pp => pp.recId === p.recId));
            } else {
                const newOnes = pagePerms.filter(pp => !prev.some(p => p.recId === pp.recId));
                return [...prev, ...newOnes];
            }
        });
    };

    // ... helper to get actions for a sub-set of pages from allPermissionsData
    const getActionsForPages = (pages) => {
        if (!pages || !allPermissionsData) return [];
        const pageKeys = new Set(pages.map(p => p.KeyPermission || p.keyPage));
        const actionsSet = new Set();
        
        allPermissionsData.forEach(perm => {
            if (!perm.name) return;
            const parts = perm.name.split(":");
            let pk, act;
            if (parts.length === 4) { pk = parts[2]; act = parts[3]; }
            else if (parts.length === 3) { pk = parts[1]; act = parts[2]; }
            else { pk = parts[0]; act = parts[1]; }
            
            if (pageKeys.has(pk)) actionsSet.add(act);
        });
        return [...actionsSet];
    };

    const isSubModuleFullySelected = (subModule) => {
        const pages = subModule.subItems || [subModule];
        const actions = getActionsForPages(pages);
        return pages.every(page => isPageFullySelected(page, actions));
    };

    const toggleSelectAllForSubModule = (subModule) => {
        const pages = subModule.subItems || [subModule];
        const actions = getActionsForPages(pages);
        const allSelected = isSubModuleFullySelected(subModule);

        let allSubPerms = [];
        pages.forEach(p => {
            allSubPerms = [...allSubPerms, ...getMatchedPermissions(p, actions)];
        });

        setSelectPermissions(prev => {
            if (allSelected) {
                return prev.filter(p => !allSubPerms.some(asp => asp.recId === p.recId));
            } else {
                const newOnes = allSubPerms.filter(asp => !prev.some(p => p.recId === asp.recId));
                return [...prev, ...newOnes];
            }
        });
    };

    const isModuleFullySelected = (module) => {
        const subModules = module.subItems || (module.items ? [{ subItems: module.items }] : []);
        return subModules.every(sm => isSubModuleFullySelected(sm));
    };

    const toggleSelectAllForModule = (module) => {
        const subModules = module.subItems || (module.items ? [{ subItems: module.items }] : []);
        const allSelected = isModuleFullySelected(module);
        
        let allModulePerms = [];
        subModules.forEach(sm => {
            const pages = sm.subItems || [sm];
            const actions = getActionsForPages(pages);
            pages.forEach(p => {
                allModulePerms = [...allModulePerms, ...getMatchedPermissions(p, actions)];
            });
        });

        setSelectPermissions(prev => {
            if (allSelected) {
                return prev.filter(p => !allModulePerms.some(amp => amp.recId === p.recId));
            } else {
                const newOnes = allModulePerms.filter(amp => !prev.some(p => p.recId === amp.recId));
                return [...prev, ...newOnes];
            }
        });
    };

    const getSelectedCountInModule = (module) => {
        const subModules = module.subItems || (module.items ? [{ subItems: module.items }] : []);
        let count = 0;
        subModules.forEach(sm => {
            const pages = sm.subItems || [sm];
            const actions = getActionsForPages(pages);
            pages.forEach(p => {
                const perms = getMatchedPermissions(p, actions);
                count += perms.filter(perm => selectPermissions.some(sp => sp.recId === perm.recId)).length;
            });
        });
        return count;
    };

    const toggleAllModulesSelection = (modules) => {
        const allSelected = modules.every(m => isModuleFullySelected(m));
        let updated = [...selectPermissions];

        modules.forEach(m => {
            const subModules = m.subItems || (m.items ? [{ subItems: m.items }] : []);
            subModules.forEach(sm => {
                const pages = sm.subItems || [sm];
                const actions = getActionsForPages(pages);
                pages.forEach(p => {
                    const pagePerms = getMatchedPermissions(p, actions);
                    pagePerms.forEach(perm => {
                        if (allSelected) {
                            updated = updated.filter(p => p.recId !== perm.recId);
                        } else if (!updated.some(up => up.recId === perm.recId)) {
                            updated.push(perm);
                        }
                    });
                });
            });
        });
        setSelectPermissions(updated);
    };

    return {
        selectPermissions,
        setSelectPermissions,
        originalPermissions,
        setOriginalPermissions,
        togglePermission,
        isPageFullySelected,
        toggleSelectAllForPage,
        isSubModuleFullySelected,
        toggleSelectAllForSubModule,
        isModuleFullySelected,
        toggleSelectAllForModule,
        toggleAllModulesSelection,
        getActionsForPages,
        getMatchedPermissions,
        getSelectedCountInModule
    };
};
