import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen grid grid-cols-[16rem_1fr]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="p-6 ">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
