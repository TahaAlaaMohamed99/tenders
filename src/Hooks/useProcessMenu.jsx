import { useMemo } from 'react';
export const useProcessMenu = (items, order, dataPages) => {
  return useMemo(() => {
    const moduleMap = {};

    // Group items by keyModule
    items.forEach((item) => {
      const elementPage = dataPages[item.keyPage];
      if (elementPage == null) {
        return null
      }
      if (!item.keyModule || item.keyModule == item.title) {
        // Add standalone items
        moduleMap[item.keyPage] = {
          keyPage: item.keyPage,
          ResourcePage: `${item.keyPage}`,
          routePage: item.routePage,
          subMenu: false,
          showMenu: item.showMenu || 'mainMenu',
        };
      } else {
        // Group sub-menu items
        if (!moduleMap[item.keyModule]) {
          moduleMap[item.keyModule] = {
            title: item.ResourceModule || item.keyModule,
            keyModule: item.keyModule,
            subMenu: true,
            subItems: [],
            showMenu: item.showMenu || 'mainMenu',
          };
        } else if (!moduleMap[item.keyModule].subItems) {
             // If entry exists but has no subItems (was standalone), convert it.
             moduleMap[item.keyModule].subItems = [];
             moduleMap[item.keyModule].subMenu = true;
             // Ensure keyModule and title are set for the converted parent
             moduleMap[item.keyModule].keyModule = item.keyModule;
             moduleMap[item.keyModule].title = moduleMap[item.keyModule].ResourcePage || item.keyModule;
             moduleMap[item.keyModule].showMenu = item.showMenu || 'mainMenu';
        }
        moduleMap[item.keyModule].subItems.push({
          keyPage: item.keyPage,
          ResourcePage: `${item.keyPage}`,
          routePage: item.routePage,
          routeModule: item?.keyModule,
          subModule: item?.subModule || null,

        });
      }
    });

    // Map and order modules based on the configuration
    return order
      .map((orderItem) => {
        // checked user we have any permission to keyModule
        const keyModule = moduleMap[orderItem.keyModule];
        return keyModule ? { ...keyModule, icon: orderItem.icon } : null;
      })
      .filter(Boolean); // Remove null values
  }, [items, order, dataPages]);
};

// Usage example:
/*
const processedMenu = useProcessMenu(
  menuItems,
  menuOrder,
  dataPages,
);
*/