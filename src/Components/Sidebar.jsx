import { useNavigate, useLocation } from "react-router-dom";
import CustomeBtn from "./CustomeBtn";
import { IconDasboard } from "../assets/Icons/IconsSvg";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: "currencies", label: "Currencies", path: "/currencies", icon: "$" },
    { id: "vendors", label: "Vendors", path: "/vendors", icon: "V" },
    { id: "vendorGroups", label: "Vendor Groups", path: "/vendor-groups", icon: "VG" },
  ];

  return (
    <aside className="bg-white shadow-lg w-50 h-screen border-r border-gray-300">
      <div className="flex items-center gap-2 p-4 border-b">
        <IconDasboard className="w-6 h-6 text-teal-600" />
        <span className="text-xl font-bold text-teal-600">Tenders</span>
      </div>

      <nav className="p-4 flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              location.pathname.startsWith(item.path + "/");

            return (
              <li key={item.id}>
                <CustomeBtn
                  type="button"
                  title={item.label}
                  icon={item.icon}
                  ResourcePage="Sidebar"
                  size="btn_md"
                  onClick={() => navigate(item.path)}
                  className={`
                    w-full justify-start gap-3 px-4 py-3
                    ${
                      isActive
                        ? "bg-blue-50 text-teal-600 font-medium hover:bg-blue-50"
                        : "text-gray-700 hover:bg-gray-50"
                    }
                  `}
                />
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
