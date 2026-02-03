/**
 * @fileoverview Menu Processing Hook
 * 
 * Processes menu items into hierarchical structure with module and subModule grouping.
 * 
 * @module Hooks/useProcessMenu
 * 
 * ## Menu Hierarchy
 * ```
 * Module (e.g., Setup)
 *   └── SubModule (e.g., Vendors & Partners) [Optional]
 *         └── Page (e.g., Vendors)
 * ```
 */

import { useMemo } from 'react';

/**
 * Process menu items into hierarchical structure
 * 
 * @param {Array} items - Menu items from SidebarLogs.json
 * @param {Array} order - Module order from ModuleOrderSidbar.json
 * @param {Object} dataPages - Page configurations from DataPages.jsx
 * @returns {Array} Processed menu structure
 * 
 * @example
 * const processedMenu = useProcessMenu(menuItems, menuOrder, dataPages);
 */
export const useProcessMenu = (items, order, dataPages) => {
  return useMemo(() => {
    const moduleMap = {};

    // Group items by keyModule and optionally by subModule
    items.forEach((item) => {
      const elementPage = dataPages[item.keyPage];
      if (elementPage == null) {
        return null;
      }

      // Standalone item (no keyModule or same as title)
      if (!item.keyModule || item.keyModule === item.title) {
        moduleMap[item.keyPage] = {
          keyPage: item.keyPage,
          ResourcePage: `${item.keyPage}`,
          routePage: item.routePage,
          subMenu: false,
          showMenu: item.showMenu || 'mainMenu',
        };
      } else {
        // Initialize module if doesn't exist
        if (!moduleMap[item.keyModule]) {
          moduleMap[item.keyModule] = {
            title: item.ResourceModule || item.keyModule,
            keyModule: item.keyModule,
            subMenu: true,
            subItems: [],
            subModules: {}, // NEW: SubModule grouping
            showMenu: item.showMenu || 'mainMenu',
          };
        } else if (!moduleMap[item.keyModule].subItems) {
          // Convert standalone to parent
          moduleMap[item.keyModule].subItems = [];
          moduleMap[item.keyModule].subModules = {};
          moduleMap[item.keyModule].subMenu = true;
          moduleMap[item.keyModule].keyModule = item.keyModule;
          moduleMap[item.keyModule].title = moduleMap[item.keyModule].ResourcePage || item.keyModule;
          moduleMap[item.keyModule].showMenu = item.showMenu || 'mainMenu';
        }

        const pageItem = {
          keyPage: item.keyPage,
          ResourcePage: `${item.keyPage}`,
          routePage: item.routePage,
          routeModule: item?.keyModule,
          subModule: item?.subModule || null,
          subItems: item.subItems || [], // Include subItems for 3rd level support
        };

        // If item has subModule, group under that subModule
        if (item.subModule) {
          if (!moduleMap[item.keyModule].subModules[item.subModule]) {
            moduleMap[item.keyModule].subModules[item.subModule] = {
              title: item.subModule,
              ResourceSubModule: item.ResourceSubModule || item.subModule,
              items: [],
            };
          }
          moduleMap[item.keyModule].subModules[item.subModule].items.push(pageItem);
        } else {
          // No subModule, add directly to subItems
          moduleMap[item.keyModule].subItems.push(pageItem);
        }
      }
    });

    // Post-process: Convert subModules object to array for rendering
    Object.values(moduleMap).forEach((module) => {
      if (module.subModules && Object.keys(module.subModules).length > 0) {
        module.hasSubModules = true;
        module.subModuleList = Object.values(module.subModules);
      } else {
        module.hasSubModules = false;
        module.subModuleList = [];
      }
    });

    // Map and order modules based on the configuration
    return order
      .map((orderItem) => {
        const keyModule = moduleMap[orderItem.keyModule];
        return keyModule ? { ...keyModule, icon: orderItem.icon } : null;
      })
      .filter(Boolean);
  }, [items, order, dataPages]);
};

/**
 * Restructure modules with subModule hierarchy
 * Utility function for sidebar rendering
 * 
 * @param {Array} modules - Processed modules from useProcessMenu
 * @returns {Array} Modules with nested subModule structure
 */
export const restructureModules = (modules) => {
  return modules.map((module) => {
    if (!module.hasSubModules) {
      return module;
    }

    // Combine direct subItems with subModule items
    return {
      ...module,
      // Direct items (no subModule)
      directItems: module.subItems || [],
      // Grouped items by subModule
      groupedItems: module.subModuleList,
    };
  });
};

// Usage example:
/*
const processedMenu = useProcessMenu(
  menuItems,
  menuOrder,
  dataPages,
);

// For subModule support:
const structuredMenu = restructureModules(processedMenu);
*/