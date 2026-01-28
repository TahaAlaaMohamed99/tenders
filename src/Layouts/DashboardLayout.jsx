import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";

export default function DashboardLayout() {
  const menuSettings = useSelector((state) => state.menuSettingsSlice);
  const isCollapsed = menuSettings?.isPinedSidebar || false;

  return (
    <div 
        className={`min-h-screen grid transition-all duration-300 ease-in-out ${
            isCollapsed ? "grid-cols-[4rem_1fr]" : "grid-cols-[16rem_1fr]"
        }`}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex flex-col h-screen overflow-hidden">
        {/* Header - Fixed at the top of the main area */}
        <div className="px-8 flex-shrink-0 bg-bgColor dark:bg-bgColorDark transition-colors">
            <Header />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar bg-bgColor dark:bg-bgColorDark transition-colors">
            <div className="max-w-7xl mx-auto">
                <Outlet />
            </div>
        </div>
      </main>
    </div>
  );
}
