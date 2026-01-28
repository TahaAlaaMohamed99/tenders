import React, { useState, useEffect, useRef, memo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createPortal } from "react-dom";
import { useSelector, useDispatch } from "react-redux"; // Redux hooks
import { useAuth } from "../context/AuthContext";
import { useProcessMenu } from "../Hooks/useProcessMenu";
import CustomBtn from "./CustomBtn";
import { LogoText, IconArrowDown, IconHelp, IconLogout, IconArrowLeft, LogoIcon} from "../assets/Icons/IconsSvg"; 
import { togglePinedSidebar } from "../store/Reducers/Layout/menuSettingsSlice"; // Action
import CustomTooltip from "./CustomTooltip";
import TranslationText from "./TranslationText";

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
    handleMouseEnter, 
    handleMouseLeave, 
    handleCollapsedClick 
}) => {
  
  const isExpanded = expandedModule === module.keyModule;

  // Check if any child is active
  const hasActiveChild =
    module.subMenu &&
    module.subItems &&
    module.subItems.some((item) => {
      const fullPath = item.routeModule
        ? `/${item.routeModule}/${item.routePage}`
        : `/${item.routePage}`;
      return isActiveRoute(fullPath);
    });

  const isParentActive = isExpanded || hasActiveChild;

  // Unique ID
  const itemId = `${module.keyModule || module.keyPage}-${index}`;

  const itemBaseClass = `
        flex items-center transition-all duration-200 border-none font-medium text-sm
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
            onMouseEnter={(e) =>
              handleMouseEnter(e, module.title || module.keyModule, itemId)
            }
            onMouseLeave={handleMouseLeave}
            onClick={(e) =>
              isCollapsed ? handleCollapsedClick(e, module) : toggleModule(module)
            }
          >
            <CustomBtn
              type="button"
              title={!isCollapsed ? module.title || module.keyModule : ""}
              ResourcePage="Sidebar"
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
                ${isExpanded ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"}
                `}
            >
              <ul className="relative ml-5 pl-4 rtl:ml-0 rtl:mr-5 rtl:pl-0 rtl:pr-4 space-y-1">
                {module.subItems.map((item, idx) => {
                  const fullPath = item.routeModule
                    ? `/${item.routeModule}/${item.routePage}`
                    : `/${item.routePage}`;
                  const isItemActive = isActiveRoute(fullPath);
                  const isLast = idx === module.subItems.length - 1;
                  
                  return (
                    <li key={item.keyPage} className="relative">
                      {/* Tree Lines */}
                      <div className="absolute -left-[11px] rtl:-right-[11px] rtl:left-auto top-0 h-[20px] w-4 border-l-2 rtl:border-l-0 rtl:border-r-2 border-b-2 border-borderColor rounded-bl-lg rtl:rounded-bl-none rtl:rounded-br-lg"></div>
                      {!isLast && (
                        <div className="absolute -left-[11px] rtl:-right-[11px] rtl:left-auto top-[20px] bottom-0 w-[1px] bg-borderColor"></div>
                      )}

                      <CustomBtn
                        type="button"
                        title={item.keyPage}
                        ResourcePage="Sidebar"
                        onClick={() => handleNavigation(fullPath)}
                        className={`
                            w-full flex items-center justify-start px-4 py-2 rounded-lg text-sm transition-all duration-200 border-none
                            ${
                              isItemActive
                                ? "!bg-gray-500 !text-white font-medium shadow-sm" // Kept specific color for sub-item active
                                : "text-textColor hover:text-titleColor hover:bg-gray-50"
                            }
                        `}
                      />
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

  // Standalone Item
  return (
    <li
      key={itemId}
      className={`select-none mb-1 group relative ${isCollapsed ? "px-0" : "px-2"}`}
    >
      <div
        onMouseEnter={(e) =>
          handleMouseEnter(e, module.title || module.keyPage, itemId)
        }
        onMouseLeave={handleMouseLeave}
      >
        <CustomBtn
          type="button"
          title={!isCollapsed ? module.title || module.keyPage : ""}
          ResourcePage="Sidebar"
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
  const isCollapsed = menuSettings?.isPinedSidebar || false;

  const [hoveredItem, setHoveredItem] = useState(null); // { id, rect, text }
  const [activeFloatingMenu, setActiveFloatingMenu] = useState(null); // { module, rect }

  // Process the menu structure
  const processedMenu = useProcessMenu(
    SidebarLogs,
    ModuleOrderSidbar,
    DataPages
  );

  // State for the single currently expanded module (Accordion behavior)
  const [expandedModule, setExpandedModule] = useState(null);

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
    logout();
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
    const hasActiveChild =
      module.subItems &&
      module.subItems.some((item) => {
        const fullPath = item.routeModule
          ? `/${item.routeModule}/${item.routePage}`
          : `/${item.routePage}`;
        return isActiveRoute(fullPath);
      });

    if (
      isOpening &&
      !hasActiveChild &&
      module.subItems &&
      module.subItems.length > 0
    ) {
      const firstItem = module.subItems[0];
      const fullPath = firstItem.routeModule
        ? `/${firstItem.routeModule}/${firstItem.routePage}`
        : `/${firstItem.routePage}`;
      handleNavigation(fullPath);
    }
  };

  // --- Handlers for Hover/Click in Collapsed Mode ---
  const handleMouseEnter = (e, text, id) => {
    if (!isCollapsed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredItem({ id, rect, text });
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const handleCollapsedClick = (e, module) => {
    if (!isCollapsed) return;

    // Navigate to first child if available and not already active
    const hasActiveChild =
      module.subItems &&
      module.subItems.some((item) => {
        const fullPath = item.routeModule
          ? `/${item.routeModule}/${item.routePage}`
          : `/${item.routePage}`;
        return isActiveRoute(fullPath);
      });

    if (
      !hasActiveChild &&
      module.subMenu &&
      module.subItems &&
      module.subItems.length > 0
    ) {
      const firstItem = module.subItems[0];
      const fullPath = firstItem.routeModule
        ? `/${firstItem.routeModule}/${firstItem.routePage}`
        : `/${firstItem.routePage}`;
      handleNavigation(fullPath);
    }

    if (module.subMenu) {
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      setActiveFloatingMenu(
        activeFloatingMenu?.module.keyModule === module.keyModule
          ? null
          : { module, rect }
      );
    } else {
      handleNavigation(module.routePage ? `/${module.routePage}` : "/");
    }
  };

  return (
    <>
      {/* Main Sidebar Container */}
      <aside
        className={`
                bg-white shadow-[4px_0_24px_rgba(0,0,0,0.02)] h-[100vh] my-auto flex flex-col font-sans rounded-2xl border-borderColor sticky top-4
                transition-all duration-300 ease-in-out relative
                ${isCollapsed ? "w-16 px-2" : "w-64 px-2"} 
                z-40
            `}
      >
        {/* Toggle Button */}
        <button
          onClick={() => dispatch(togglePinedSidebar())}
          className="absolute -right-3 rtl:right-auto rtl:-left-3 top-9 w-6 h-6 bg-white border border-borderColor rounded-lg flex items-center justify-center shadow-md text-borderColor hover:text-primary transition-all duration-200 z-50 focus:outline-none hover:scale-105 active:scale-95"
          style={{ marginTop: "-14px" }}
        >
          <IconArrowLeft
            className={`w-3 h-3 transition-transform duration-300 ${
              isCollapsed ? (document.dir==="rtl" ? "" : "rotate-180") : (document.dir==="rtl" ? "rotate-180" : "")
            }`}
          />
        </button>

        {/* Logo Section */}
        <div
          className={`flex items-center gap-2 mt-4 mb-4 ${
            isCollapsed ? "justify-center" : "justify-start ps-4"
          } transition-all duration-300 overflow-visible`}
        >
          <LogoIcon className="w-8 h-8 shrink-0 text-primary" />
          {!isCollapsed && <LogoText className="h-6" />}
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
                    handleMouseEnter={handleMouseEnter}
                    handleMouseLeave={handleMouseLeave}
                    handleCollapsedClick={handleCollapsedClick}
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
                      handleMouseEnter={handleMouseEnter}
                      handleMouseLeave={handleMouseLeave}
                      handleCollapsedClick={handleCollapsedClick}
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
            <div
              onMouseEnter={(e) => handleMouseEnter(e, "Help", "help-btn")}
              onMouseLeave={handleMouseLeave}
            >
              <CustomBtn
                type="button"
                title={!isCollapsed ? "Help" : ""}
                ResourcePage="Sidebar"
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
            <div
              onMouseEnter={(e) => handleMouseEnter(e, "Logout", "logout-btn")}
              onMouseLeave={handleMouseLeave}
            >
              <CustomBtn
                type="button"
                title={!isCollapsed ? "LogoutAccount" : ""}
                ResourcePage="Sidebar"
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
                  <IconLogout className="w-5 h-5 text-error transition-transform group-hover:scale-110" />
                }
              />
            </div>
          </div>
        </div>
      </aside>

      {/* Portals for Tooltips and Menus */}
      {isCollapsed && (
        <>
          {hoveredItem && !activeFloatingMenu && (
            <CustomTooltip
              content={hoveredItem.text} // This is the translation key
              ResourcePage="Sidebar"
              rect={hoveredItem.rect}
              visible={true}
              placement={document.documentElement.dir === "rtl" ? "left" : "right"}
            />
          )}
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
    </>
  );
}