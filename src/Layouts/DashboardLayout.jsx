import Sidebar from "../Components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen grid grid-cols-[12rem_1fr]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
