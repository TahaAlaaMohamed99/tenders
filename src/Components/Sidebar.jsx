import React, { useState, useEffect, useRef, memo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createPortal } from "react-dom";
import { useSelector, useDispatch } from "react-redux"; // Redux hooks
import { useAuth } from "../Context/AuthContext";
import { useProcessMenu } from "../Hooks/useProcessMenu";
import CustomBtn from "./CustomBtn";
import { LogoText, IconArrowDown, IconHelp, IconLogout, IconArrowLeft, LogoIcon, IconTreeView } from "../assets/Icons"; 
import { IconTree, IconTreeEnd } from "../assets/Icons/StatusIcons"; 
import { toggleSidebarExpanded } from "../store/Reducers/Layout/menuSettingsSlice"; // Action
import TranslationText from "./TranslationText";
import ConfirmationModal from "./ConfirmationModal";

// Configuration Data
import SidebarLogs from "../ConfigData/SidebarLogs.json";
import { ModuleOrderSidbar } from "../ConfigData/OrderMenus";
import { DataPages } from "../ConfigData/DataPages";

// --- Sub-Components ---

// 1. Floating Menu Component
const FloatingMenu = ({ module, rect, onClose, handleNavigation, isActiveRoute }) => {
  const menuRef = useRef(null);

  // Close processing
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!rect) return null;

  // Calculate top position
  const topPos = Math.max(10, Math.min(window.innerHeight - 200, rect.top));
  const isRTL = document.documentElement.dir === "rtl";

  const style = {
    top: topPos,
    position: "fixed",
    zIndex: 9999,
  };

  if (isRTL) {
      style.right = window.innerWidth - rect.left + 10;
      style.left = "auto";
  } else {
      style.left = rect.right + 10;
      style.right = "auto";
  }

  return createPortal(
    <div
      ref={menuRef}
      style={style}
      className="bg-white border border-borderColor shadow-2xl rounded-2xl p-2 w-56 animate-in fade-in zoom-in-95 duration-200"
    >
      <ul className="space-y-1">
        {/* Direct Items */}
        {module.subItems?.map((item) => {
          const fullPath = item.routeModule
            ? `/${item.routeModule}/${item.routePage}`
            : `/${item.routePage}`;
          const active = isActiveRoute(fullPath);
          return (
            <li key={item.keyPage}>
              <button
                onClick={() => {
                  handleNavigation(fullPath);
                  onClose();
                }}
                className={`w-full text-start px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  active
                    ? "bg-primary text-white shadow-md"
                    : "text-textColor hover:bg-gray-50 hover:text-titleColor"
                }`}
              >
                <TranslationText page="Sidebar" title={item.keyPage} />
              </button>
            </li>
          );
        })}

        {/* SubModules */}
        {module.subModuleList?.map((subMod) => (
           <React.Fragment key={subMod.title}>
             {/* Optional Header for SubModule in Menu? Maybe a separator? */}
             <li className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider border-t border-gray-100 mt-1 pt-2">
                 <TranslationText page="Sidebar" title={subMod.ResourceSubModule} />
             </li>
             
             {subMod.items.map((item) => {
                const fullPath = item.routeModule
                  ? `/${item.routeModule}/${item.routePage}`
                  : `/${item.routePage}`;
                const active = isActiveRoute(fullPath);
                return (
                    <li key={item.keyPage}>
                    <button
                        onClick={() => {
                        handleNavigation(fullPath);
                        onClose();
                        }}
                        className={`w-full text-start px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                        active
                            ? "bg-primary text-white shadow-md"
                            : "text-textColor hover:bg-gray-50 hover:text-titleColor"
                        }`}
                    >
                        <TranslationText page="Sidebar" title={item.keyPage} />
                    </button>
                    </li>
                );
             })}
           </React.Fragment>
        ))}
      </ul>
    </div>,
    document.body
  );
};

// 2. SidebarItem Component (Handles individual items logic)
const SidebarItem = memo(({ 
    module, 
    index, 
    isCollapsed, 
    expandedModule, 
    toggleModule, 
    handleNavigation, 
    isActiveRoute, 
    handleCollapsedClick,
    activeFloatingMenu 
}) => {
  
  const isExpanded = expandedModule === module.keyModule;

  // State for collapsible sub-items (3rd level)
  const [expandedSubObjects, setExpandedSubObjects] = useState({});

  useEffect(() => {
    // If submodule is collapsed (parent module closed), reset 3rd level?
    // Or keep them open? Let's reset for cleaner UX or keep logic simple.
  }, [expandedModule]);

  const toggleSubObject = (key) => {
    setExpandedSubObjects(prev => ({
        ...prev,
        [key]: !prev[key]
    }));
  }

  // Check if any child is active
  const hasActiveChild =
    module.subMenu &&
    module.subItems &&
    module.subItems.some((item) => {
      const fullPath = item.routeModule
        ? `/${item.routeModule}/${item.routePage}`
        : `/${item.routePage}`;
       if (isActiveRoute(fullPath)) return true;
       // Check 3rd level
       if (item.subItems) {
           return item.subItems.some(sub => {
                const subPath = `/${item.routePage}/${sub.routePage}`; // Assumption on route structure
                return isActiveRoute(subPath);
           });
       }
       return false;
    });

  const isParentActive = isExpanded || hasActiveChild;

  // Unique ID
  const itemId = `${module.keyModule || module.keyPage}-${index}`;

  const itemBaseClass = `
        flex items-center transition-all duration-300 ease-in-out border-none font-medium text-sm
        ${
          isCollapsed
            ? "justify-center px-0 w-10 h-10 mx-auto rounded-xl sm:min-w-0"
            : "justify-start px-4 py-2.5 rounded-xl gap-3 w-full"
        }
    `;

  const activeClass = "!bg-primary !text-white !shadow-md";
  const inactiveClass = "text-textColor hover:text-titleColor hover:bg-gray-50";

  const isSelfActive = module.subMenu
    ? isParentActive
    : isActiveRoute(module.routePage ? `/${module.routePage}` : "/");

  const buttonClass = `${itemBaseClass} ${
    isSelfActive ? activeClass : inactiveClass
  }`;

  if (module.subMenu) {
    return (
      <li
        key={itemId}
        className={`select-none mb-1 group relative ${isCollapsed ? "px-0" : "px-2"}`}
      >
        {/* Module with Sub-Items */}
        <div>
          <div
            className="relative"
            onClick={(e) =>
              isCollapsed ? handleCollapsedClick(e, module) : toggleModule(module)
            }
          >
            <CustomBtn
              type="button"
              title={!isCollapsed ? module.title || module.keyModule : ""}
              ResourcePage="Sidebar"
              // Pass tooltip if collapsed
              tooltip={isCollapsed ? module.title || module.keyModule : ""} 
              // Force placement to "top" if this menu is open, else side
              tooltipPlacement={
                activeFloatingMenu?.module?.keyModule === module.keyModule
                  ? "top"
                  : document.documentElement.dir === "rtl"
                  ? "left"
                  : "right"
              }
              className={buttonClass}
              icon={
                <span
                  className={`w-5 h-5 flex items-center justify-center transition-colors ${
                    isSelfActive ? "!text-white" : "text-gray-400 group-hover:text-gray-600"
                  }`}
                >
                  {module.icon}
                </span>
              }
            />
            {!isCollapsed && (
              <span
                className={`absolute right-4 rtl:left-4 rtl:right-auto top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : ""
                } ${isSelfActive ? "!text-white" : "text-gray-400"}`}
              >
                <IconArrowDown className="w-2.5 h-2.5" />
              </span>
            )}
          </div>

          {/* Sub Items Container - Tree View (Expanded Mode Only) */}
          {!isCollapsed && (
            <div
              className={`
                overflow-hidden transition-all duration-300 ease-in-out
                ${isExpanded ? "max-h-[1000px] opacity-100 mt-1" : "max-h-0 opacity-0"}
                `}
            >
                  <ul className="relative ml-5 pl-4 rtl:ml-0 rtl:mr-5 rtl:pl-0 rtl:pr-4">
                    {/* Direct Child Items */}
                    {module.subItems.map((item, idx) => {
                      const fullPath = item.routeModule
                        ? `/${item.routeModule}/${item.routePage}`
                        : `/${item.routePage}`;
                      const isItemActive = isActiveRoute(fullPath);
                      
                      const hasSubModules = module.subModuleList && module.subModuleList.length > 0;
                      const isLastDirectItem = idx === module.subItems.length - 1;
                      // Logic: If there are submodules following, this is NOT the last visual item in the tree spine.
                      const isVisuallyLastInfo = isLastDirectItem && !hasSubModules; 
                      
                      const has3rdLevel = item.subItems && item.subItems.length > 0;
                      const is3rdLevelOpen = expandedSubObjects[item.keyPage];

                      return (
                        <li key={item.keyPage} className="relative">
                          {/* Tree Lines - SVG Icons */}
                          <div className="absolute -left-[20px] rtl:-right-[20px] rtl:left-auto top-0 w-5 h-full flex flex-col items-center rtl:scale-x-[-1]">
                              {/* Continuous Spine Line for non-last items */}
                              {!isVisuallyLastInfo && (
                                  <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-gray-300 h-full"></div>
                              )}
                              {/* The L-curve for this item */}
                              <IconTreeEnd className="text-gray-300 w-full h-auto z-10" />
                          </div>

                        {/* Item Row */}
                        <div 
                            className="relative"
                            onClick={(e) => {
                                if(has3rdLevel) {
                                    e.stopPropagation();
                                    toggleSubObject(item.keyPage);
                                } else {
                                    handleNavigation(fullPath);
                                }
                            }}
                        >
                            <CustomBtn
                            type="button"
                            title={item.keyPage}
                            ResourcePage="Sidebar"
                            className={`
                                w-full flex items-center justify-start px-4 py-2 rounded-lg text-sm transition-all duration-200 border-none relative
                                ${
                                    isItemActive
                                    ? "!bg-gray-500 !text-white font-medium shadow-sm"
                                    : "text-textColor hover:text-titleColor hover:bg-gray-50"
                                }
                            `}
                            // Render arrow if 3rd level exists
                            icon={has3rdLevel ? (
                                <span className={`absolute right-2 rtl:left-2 rtl:right-auto transition-transform duration-200 ${is3rdLevelOpen ? 'rotate-180' : ''}`}>
                                     <IconArrowDown className="w-2 h-2" />
                                </span>
                            ) : null}
                            />
                        </div>

                        {/* 3rd Level Render */}
                        {has3rdLevel && (
                             <div className={`
                                overflow-hidden transition-all duration-300 ease-in-out
                                ${is3rdLevelOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
                             `}>
                                 <ul className="relative ml-6 rtl:mr-6 rtl:ml-0 pl-2 rtl:pr-2">
                                     {item.subItems.map((sub, sIdx) => {
                                         const subPath = `/${sub.routePage}`; // Simple path construction for now
                                         const isSubActive = isActiveRoute(subPath);
                                         const isLastSub = sIdx === item.subItems.length - 1;

                                         return (
                                             <li key={sub.keyPage} className="relative">
                                                  {/* Level 3 Spine */}
                                                  <div className="absolute -left-[20px] rtl:-right-[20px] rtl:left-auto top-0 w-5 h-full flex flex-col items-center rtl:scale-x-[-1]">
                                                      {!isLastSub && (
                                                          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-gray-300 h-full"></div>
                                                      )}
                                                      <IconTreeEnd className="text-gray-300 w-full h-auto z-10" />
                                                  </div>
                                                  
                                                  <CustomBtn
                                                    type="button"
                                                    title={sub.keyPage}
                                                    ResourcePage="Sidebar"
                                                    onClick={() => handleNavigation(subPath)} // Demo nav
                                                    className={`
                                                        text-xs py-1.5 px-3 rounded-md w-full text-start
                                                        ${
                                                            isSubActive
                                                            ? "bg-gray-200 text-gray-900 font-medium"
                                                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                                        }
                                                    `}
                                                  />
                                             </li>
                                         )
                                      })}
                                  </ul>
                             </div>
                        )}
                      </li>
                    );
                  })}

                  {/* SubModules (Grouped Items) */ }
                  {module.subModuleList && module.subModuleList.map((subMod, modIdx) => {
                      const isLastModule = modIdx === module.subModuleList.length - 1;
                      
                      return (
                        <li key={subMod.title} className="relative pt-2">
                              {/* Line connecting from previous elements (Main Spine) */}
                              <div className="absolute -left-[20px] rtl:-right-[20px] rtl:left-auto top-0 bottom-0 w-5 flex justify-center h-full z-0">
                                  {/* If last module, line stops at center (h-1/2), else full height */}
                                  <div className={`w-[2px] bg-gray-300 ${isLastModule ? 'h-1/2' : 'h-full'}`}></div>
                              </div>

                              {/* Group Title Node */}
                              <div className="relative pl-6 rtl:pl-0 rtl:pr-6 mb-1 z-10 flex items-center">
                                  {/* Icon Tree View as generic folder icon */}
                                  <div className="absolute -left-[20px] rtl:-right-[20px] rtl:left-auto flex items-center justify-center bg-white rtl:scale-x-[-1] w-5">
                                      <IconTreeView className="w-4 h-4 text-gray-400 bg-white" /> 
                                  </div>

                                  <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 rtl:mr-1">
                                      <TranslationText page="Sidebar" title={subMod.ResourceSubModule} />
                                  </h4>
                              </div>

                              {/* Items in this SubModule */}
                              <ul className="relative ml-4 pl-4 rtl:ml-0 rtl:mr-4 rtl:pl-0 rtl:pr-4">
                                  {subMod.items.map((item, itemIdx) => {
                                      const fullPath = item.routeModule
                                        ? `/${item.routeModule}/${item.routePage}`
                                        : `/${item.routePage}`;
                                      const isItemActive = isActiveRoute(fullPath);
                                      const isLastItem = itemIdx === subMod.items.length - 1;
                                      const has3rdLevel = item.subItems && item.subItems.length > 0;
                                      const is3rdLevelOpen = expandedSubObjects[item.keyPage];

                                      return (
                                        <li key={item.keyPage} className="relative">
                                            {/* Tree Lines - Level 2 Spine */}
                                            <div className="absolute -left-[20px] rtl:-right-[20px] rtl:left-auto top-0 w-5 h-full flex flex-col items-center rtl:scale-x-[-1]">
                                                {/* Continuous Spine Line for non-last items */}
                                                {!isLastItem && (
                                                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-gray-300 h-full"></div>
                                                )}
                                                <IconTreeEnd className="text-gray-300 w-full h-auto z-10" />
                                            </div>

                                            <div 
                                                className="relative"
                                                onClick={(e) => {
                                                    if(has3rdLevel) {
                                                        e.stopPropagation();
                                                        toggleSubObject(item.keyPage);
                                                    } else {
                                                        handleNavigation(fullPath);
                                                    }
                                                }}
                                            >
                                                <CustomBtn
                                                    type="button"
                                                    title={item.keyPage}
                                                    ResourcePage="Sidebar"
                                                    className={`
                                                        w-full flex items-center justify-start px-4 py-2 rounded-lg text-sm transition-all duration-200 border-none
                                                        ${
                                                            isItemActive
                                                            ? "!bg-gray-500 !text-white font-medium shadow-sm"
                                                            : "text-textColor hover:text-titleColor hover:bg-gray-50"
                                                        }
                                                    `}
                                                    icon={has3rdLevel ? (
                                                        <span className={`absolute right-2 rtl:left-2 rtl:right-auto transition-transform duration-200 ${is3rdLevelOpen ? 'rotate-180' : ''}`}>
                                                            <IconArrowDown className="w-2 h-2" />
                                                        </span>
                                                    ) : null}
                                                />
                                            </div>

                                            {/* 3rd Level Render (duplicate logic for now, could be componentized) */}
                                            {has3rdLevel && (
                                                <div className={`
                                                    overflow-hidden transition-all duration-300 ease-in-out
                                                    ${is3rdLevelOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
                                                `}>
                                                    <ul className="relative ml-6 rtl:mr-6 rtl:ml-0 pl-2 rtl:pr-2">
                                                        {item.subItems.map((sub, sIdx) => {
                                                            const subPath = `/${item.routePage}/${sub.routePage}`; // Fix parent route usage
                                                            const isSubActive = isActiveRoute(subPath);
                                                            const isLastSub = sIdx === item.subItems.length - 1;

                                                            return (
                                                                <li key={sub.keyPage} className="relative">
                                                                    {/* Level 3 Spine */}
                                                                    <div className="absolute -left-[20px] rtl:-right-[20px] rtl:left-auto top-0 w-5 h-full flex flex-col items-center rtl:scale-x-[-1]">
                                                                        {!isLastSub && (
                                                                            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-gray-300 h-full"></div>
                                                                        )}
                                                                        <IconTreeEnd className="text-gray-300 w-full h-auto z-10" />
                                                                    </div>
                                                                    <CustomBtn
                                                                        type="button"
                                                                        title={sub.keyPage}
                                                                        ResourcePage="Sidebar"
                                                                        onClick={() => handleNavigation(subPath)}
                                                                        className={`
                                                                            text-xs py-1.5 px-3 rounded-md w-full text-start
                                                                            ${
                                                                                isSubActive
                                                                                ? "bg-gray-200 text-gray-900 font-medium"
                                                                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                                                            }
                                                                        `}
                                                                    />
                                                                </li>
                                                            )
                                                        })}
                                                    </ul>
                                                </div>
                                            )}
                                        </li>
                                     );
                                 })}
                             </ul>
                        </li>
                     );
                  })}
                </ul>
            </div>
          )}
        </div>
      </li>
    );
  }
  
  // Standalone Item... (remains mostly same, just check if it needs update)
  {/* The rest of the component (Standalone Item) is usually fine if it doesn't have children */}
  return (
    <li
      key={itemId}
      className={`select-none mb-1 group relative ${isCollapsed ? "px-0" : "px-2"}`}
    >
      <div>
        <CustomBtn
          type="button"
          title={!isCollapsed ? module.title || module.keyPage : ""}
          ResourcePage="Sidebar"
          // Pass tooltip if collapsed
          tooltip={isCollapsed ? module.title || module.keyPage : ""}
          // Force placement to the side
          tooltipPlacement={document.documentElement.dir === "rtl" ? "left" : "right"}
          onClick={() =>
            handleNavigation(module.routePage ? `/${module.routePage}` : "/")
          }
          className={buttonClass}
          icon={
            <span
              className={`w-5 h-5 flex items-center justify-center transition-colors ${
                isSelfActive ? "!text-white" : "text-gray-400 group-hover:text-gray-600"
              }`}
            >
              {module.icon}
            </span>
          }
        />
      </div>
    </li>
  );
});

// --- Main Sidebar Component ---
export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { logout } = useAuth();

  const menuSettings = useSelector((state) => state.menuSettingsSlice);
  const isCollapsed = !menuSettings?.isSidebarExpanded;

  const [activeFloatingMenu, setActiveFloatingMenu] = useState(null); // { module, rect }

  // Process the menu structure
  const processedMenu = useProcessMenu(
    SidebarLogs,
    ModuleOrderSidbar,
    DataPages
  );

  const [expandedModule, setExpandedModule] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Initialize expanded state based on current route (Auto-expand active parent)
  useEffect(() => {
    const currentPath = location.pathname;

    // Find the module that contains the active child
    const activeModule = processedMenu.find((module) => {
      if (module.subMenu && module.subItems) {
        return module.subItems.some((item) => {
          const fullPath = item.routeModule
            ? `/${item.routeModule}/${item.routePage}`
            : `/${item.routePage}`;
          return (
            currentPath === fullPath || currentPath.startsWith(fullPath + "/")
          );
        });
      }
      return false;
    });

    if (activeModule) {
      setExpandedModule(activeModule.keyModule);
    } else {
      // Clear active state if we are on a page that doesn't belong to a module
      setExpandedModule(null);
    }
  }, [location.pathname, processedMenu]);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    navigate("/login");
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActiveRoute = (route) => {
    if (!route) return false;
    const current = location.pathname.toLowerCase();
    const target = route.toLowerCase();

    if (current === target) return true;

    // Sub-route match (ensure it has a slash boundary)
    if (current.startsWith(target + "/")) return true;

    // Handle root "/" specific case if target is "/"
    if (target === "/" && current === "/") return true;

    return false;
  };

  const toggleModule = (module) => {
    if (isCollapsed) return;

    // Check if we are opening a new module or closing the current one
    const isOpening = expandedModule !== module.keyModule;
    setExpandedModule(isOpening ? module.keyModule : null);

    // Navigate to first child if no child is currently active
  //   const hasActiveChild =
  //     module.subItems &&
  //     module.subItems.some((item) => {
  //       const fullPath = item.routeModule
  //         ? `/${item.routeModule}/${item.routePage}`
  //         : `/${item.routePage}`;
  //       return isActiveRoute(fullPath);
  //     });

  //   if (
  //     isOpening &&
  //     !hasActiveChild &&
  //     module.subItems &&
  //     module.subItems.length > 0
  //   ) {
  //     const firstItem = module.subItems[0];
  //     const fullPath = firstItem.routeModule
  //       ? `/${firstItem.routeModule}/${firstItem.routePage}`
  //       : `/${firstItem.routePage}`;
  //     handleNavigation(fullPath);
  //   }
  };

  // --- Handlers for Hover/Click in Collapsed Mode ---

  const handleCollapsedClick = (e, module) => {
    if (!isCollapsed) return;

    // Navigate to first child if available and not already active
    // const hasActiveChild =
    //   module.subItems &&
    //   module.subItems.some((item) => {
    //     const fullPath = item.routeModule
    //       ? `/${item.routeModule}/${item.routePage}`
    //       : `/${item.routePage}`;
    //     return isActiveRoute(fullPath);
    //   });

    // if (
    //   !hasActiveChild &&
    //   module.subMenu &&
    //   module.subItems &&
    //   module.subItems.length > 0
    // ) {
    //   const firstItem = module.subItems[0];
    //   const fullPath = firstItem.routeModule
    //     ? `/${firstItem.routeModule}/${firstItem.routePage}`
    //     : `/${firstItem.routePage}`;
    //   handleNavigation(fullPath);
    // }

    if (module.subMenu) {
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      setActiveFloatingMenu(
        activeFloatingMenu?.module.keyModule === module.keyModule
          ? null
          : { module, rect }
      );
    } else {
      // For standalone items, navigate directly
      handleNavigation(module.routePage ? `/${module.routePage}` : "/");
    }
  };

  return (
    <>
      {/* Main Sidebar Container */}
      <aside
        className={`
                m-2 bg-white shadow-[4px_0_24px_rgba(0,0,0,0.02)] h-[calc(100vh-16px)] flex flex-col font-sans rounded-2xl border-borderColor sticky top-2
                relative transition-all duration-300 ease-in-out
                ${isCollapsed ? "w-16 px-2" : "w-64 px-2"} 
                z-40
            `}
      >
        {/* Toggle Button */}
        <button
          onClick={() => dispatch(toggleSidebarExpanded())}
          className="absolute -right-3 rtl:right-auto rtl:-left-3 top-9 w-6 h-6 bg-white border border-borderColor rounded-lg flex items-center justify-center shadow-md text-borderColor hover:text-primary transition-all duration-200 z-50 focus:outline-none hover:scale-105 active:scale-95"
          style={{ marginTop: "-14px" }}
        >
          <IconArrowLeft
            className={`w-3 h-3 transition-transform duration-300 ${
              isCollapsed 
                ? "rotate-180 rtl:rotate-0" 
                : "rotate-0 rtl:rotate-180"
            }`}
          />
        </button>

        {/* Logo Section */}
        <div
          className={`flex items-center gap-2 mt-4 mb-4 transition-all duration-300 ease-in-out ${
            isCollapsed ? "justify-center" : "justify-start ps-4"
          } overflow-hidden`}
        >
          <LogoIcon className="w-8 h-8 shrink-0 text-primary transition-transform duration-300" />
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
            <LogoText className="h-6 whitespace-nowrap" />
          </div>
        </div>

        {/* Separator */}
        <div className="mx-4 mb-2 h-px bg-borderColor"></div>

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-visible flex flex-col custom-scrollbar pb-6 relative">
          <nav className="">
            <ul className="space-y-1">
              {processedMenu
                .filter((m) => m.showMenu === "mainMenu")
                .map((module, index) => (
                  <SidebarItem
                    key={`${module.keyModule || module.keyPage}-${index}`}
                    module={module}
                    index={index}
                    isCollapsed={isCollapsed}
                    expandedModule={expandedModule}
                    toggleModule={toggleModule}
                    handleNavigation={handleNavigation}
                    isActiveRoute={isActiveRoute}
                    handleCollapsedClick={handleCollapsedClick}
                    activeFloatingMenu={activeFloatingMenu}
                  />
                ))}
            </ul>
          </nav>

          {/* Settings Section */}
          {processedMenu.some((m) => m.showMenu === "settings") && (
            <div className="mb-2">
              {/* Subtle Divider */}
              <div className="mx-4 my-1.5 h-px bg-borderColor"></div>

              <ul className="space-y-1">
                {processedMenu
                  .filter((m) => m.showMenu === "settings")
                  .map((module, index) => (
                    <SidebarItem
                      key={`s-${module.keyModule || module.keyPage}-${index}`}
                      module={module}
                      index={`s-${index}`}
                      isCollapsed={isCollapsed}
                      expandedModule={expandedModule}
                      toggleModule={toggleModule}
                      handleNavigation={handleNavigation}
                      isActiveRoute={isActiveRoute}
                      handleCollapsedClick={handleCollapsedClick}
                      activeFloatingMenu={activeFloatingMenu}
                    />
                  ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer / Logout */}
        <div className={`${isCollapsed ? "p-0" : "p-2"} mt-auto mb-4`}>
          <div className="flex flex-col gap-1">
            {/* Help */}
            <div>
              <CustomBtn
                type="button"
                title={!isCollapsed ? "Help" : ""} // key
                ResourcePage="Sidebar"
                tooltip={isCollapsed ? "Help" : ""} 
                // Force placement to the side
                tooltipPlacement={document.documentElement.dir === "rtl" ? "left" : "right"}
                className={`
                        flex items-center transition-colors font-medium text-sm border-none rounded-xl
                        ${
                          isCollapsed
                            ? "justify-center w-10 h-10 mx-auto sm:min-w-0"
                            : "justify-start px-4 py-2.5 gap-3 text-textColor hover:text-titleColor hover:bg-gray-50 w-full"
                        }
                    `}
                icon={
                  <IconHelp className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                }
              />
            </div>

            {/* Logout */}
            <div>
              <CustomBtn
                type="button"
                title={!isCollapsed ? "logout" : ""} // key
                ResourcePage="General" // Usually logout is in General
                tooltip={isCollapsed ? "logout" : ""}
                // Force placement to the side
                tooltipPlacement={document.documentElement.dir === "rtl" ? "left" : "right"}
                onClick={handleLogout}
                className={`
                        flex items-center transition-colors font-medium text-sm border-none rounded-xl group
                        ${
                          isCollapsed
                            ? "justify-center w-10 h-10 mx-auto sm:min-w-0"
                            : "justify-start px-4 py-2.5 gap-3 text-error hover:bg-red-50 w-full"
                        }
                    `}
                icon={
                  <IconLogout className="w-5 h-5 text-error transition-transform group-hover:scale-110 rtl:scale-x-[-1]" />
                }
              />
            </div>
          </div>
        </div>
      </aside>

      {/* Portals for Tooltips and Menus */}
      {isCollapsed && (
        <>
          {activeFloatingMenu && (
            <FloatingMenu
              module={activeFloatingMenu.module}
              rect={activeFloatingMenu.rect}
              onClose={() => setActiveFloatingMenu(null)}
              handleNavigation={handleNavigation}
              isActiveRoute={isActiveRoute}
            />
          )}
        </>
      )}

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isVisible={showLogoutConfirm}
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
        title="logout"
        subTitle=""
        description="areYouSureYouWantToLogout"
        type="delete"
        confirmButtonLabel="logout"
        cancelButtonLabel="cancel"
        icon={<IconLogout className="w-12 h-12" />}
        ResourcePage="General"
      />
    </>
  );
}