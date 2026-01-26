import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProcessMenu } from "../Hooks/useProcessMenu";
import CustomBtn from "./CustomBtn";
import { LogoName, IconArrowDown, IconArrowLeft } from "../assets/Icons/IconsSvg";

// Configuration Data
import SidebarLogs from "../ConfigData/SidebarLogs.json";
import { ModuleOrderSidbar } from "../ConfigData/OrderMenus";
import { DataPages } from "../ConfigData/DataPages";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

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
    const activeModule = processedMenu.find(module => {
      if (module.subMenu && module.subItems) {
        return module.subItems.some(item => {
           const fullPath = item.routeModule ? `/${item.routeModule}/${item.routePage}` : `/${item.routePage}`;
           return currentPath === fullPath || currentPath.startsWith(fullPath + "/");
        });
      }
      return false;
    });

    if (activeModule) {
      setExpandedModule(activeModule.keyModule);
    } else {
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

  const toggleModule = (keyModule) => {
    setExpandedModule(prev => (prev === keyModule ? null : keyModule));
  };

  const isActiveRoute = (route) => {
    if (!route) return false;
    const current = location.pathname.toLowerCase();
    const target = route.toLowerCase();
    
    // Exact match
    if (current === target) return true;
    
    // Sub-route match (ensure it has a slash boundary)
    if (current.startsWith(target + "/")) return true;
    
    // Handle root "/" specific case if target is "/"
    if (target === "/" && current === "/") return true;

    return false;
  };

  const renderMenuItem = (module, index) => {
    const isExpanded = expandedModule === module.keyModule;
    
    // Check if any child is active to keep parent highlighted if collapsed
    const hasActiveChild = module.subMenu && module.subItems && module.subItems.some(item => {
       const fullPath = item.routeModule ? `/${item.routeModule}/${item.routePage}` : `/${item.routePage}`;
       return isActiveRoute(fullPath);
    });

    const isParentActive = isExpanded || hasActiveChild;
    
    return (
    <li key={module.keyModule || module.keyPage || index} className="select-none">
      {module.subMenu ? (
        /* Module with Sub-Items (Accordion) */
        <div className="mb-2">
          <button
            onClick={() => toggleModule(module.keyModule)}
            className={`
              w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 group
              ${isParentActive ? "bg-slate-800 text-white shadow-md" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}
            `}
          >
            <div className="flex items-center gap-3">
              <span className={`w-5 h-5 ${isParentActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"}`}>
                {module.icon}
              </span>
              <span className="font-medium text-sm">{module.title || module.keyModule}</span>
            </div>
            <span className={`transition-transform duration-200 ${isExpanded ? "rotate-180 text-white" : "text-gray-400 group-hover:text-gray-600"} ${!isExpanded && isParentActive ? "text-white" : ""}`}>
                  <IconArrowDown className="w-3 h-3" />
            </span>
          </button>
          
          {/* Sub Items Container */}
          <div 
            className={`
              overflow-hidden transition-all duration-300 ease-in-out
              ${isExpanded ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"}
            `}
          >
            <ul className="relative pl-6 space-y-1.5 ml-2 border-l-2 border-gray-200">
              {module.subItems.map((item) => {
                const fullPath = item.routeModule ? `/${item.routeModule}/${item.routePage}` : `/${item.routePage}`;
                const isItemActive = isActiveRoute(fullPath);

                return (
                  <li key={item.keyPage} className="relative">
                    {/* Tree curve connector for active/hover effect (optional visual polish) */}
                    <div className={`absolute -left-[2px] top-1/2 -translate-y-1/2 w-4 h-[2px] ${isItemActive ? "bg-slate-800" : "bg-transparent"} rounded-r-md`}></div>

                    <button
                      onClick={() => handleNavigation(fullPath)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200
                        ${
                          isItemActive
                            ? "bg-gray-500 text-white font-medium shadow-sm"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                        }
                      `}
                    >
                      <span>{item.keyPage}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : (
        /* Standalone Item */
        <button
          onClick={() => handleNavigation(module.routePage ? `/${module.routePage}` : '/')}
          className={`
            w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-sm transition-all duration-200 mb-1
            ${
              isActiveRoute(module.routePage ? `/${module.routePage}` : '/') && !expandedModule // Only active if no module is expanded (single visual focus)
              ? "bg-slate-800 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }
          `}
        >
          <span className={`w-5 h-5 ${isActiveRoute(module.routePage ? `/${module.routePage}` : '/') && !expandedModule ? "text-white" : "text-gray-400"}`}>
            {module.icon}
          </span>
          <span>{module.title || module.keyPage}</span>
        </button>
      )}
    </li>
  );
  };

  return (
    <aside className="bg-white shadow-lg w-64 h-screen flex flex-col font-sans border-r border-gray-100 sticky top-0">
      {/* Logo Section */}
      <div className="flex items-center justify-center p-6 border-b border-gray-50 mb-4">
        <LogoName className="w-40 text-primary" />
      </div>

      {/* Main Navigation (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-4 custom-scrollbar flex flex-col">
        {/* Main Menu Items */}
        <nav>
            <ul className="space-y-1">
            {processedMenu.filter(m => m.showMenu === 'mainMenu').map((module, index) => renderMenuItem(module, index))}
            </ul>
        </nav>

        {/* Settings Section - Attached to flow but visibly separated */}
        {processedMenu.some(m => m.showMenu === 'settings') && (
            <div className="mt-2 mb-6"> {/** mb-6 = 24px as requested */}
                 <div className="border-t border-gray-100 my-4 mx-2"></div>
                 <ul className="space-y-1">
                 {processedMenu.filter(m => m.showMenu === 'settings').map((module, index) => renderMenuItem(module, `s-${index}`))}
                 </ul>
            </div>
        )}
      </div>

      {/* Spacer is automatic due to flex-1 on the container above pushing footer down if content is small */}
      
      {/* Footer / Logout */}
      <div className="p-4 mt-auto border-t border-gray-50">
        <div className="flex flex-col gap-2">
            <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors px-2 py-1 text-sm font-medium">
               <span className="w-5 h-5 flex items-center justify-center border border-gray-400 rounded-full text-xs">?</span>
               Help
            </button>
            <CustomBtn
            type="button"
            title="Logout Account"
            ResourcePage="Sidebar"
            size="btn_md"
            onClick={handleLogout}
            className="w-full justify-start gap-3 px-2 py-2 text-red-600 hover:bg-red-50 border-none transition-colors font-medium text-sm"
            />
        </div>
      </div>
    </aside>
  );
}