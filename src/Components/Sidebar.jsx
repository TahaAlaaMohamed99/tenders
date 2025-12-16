import { useNavigate, useLocation } from "react-router-dom";
import CustomeBtn from "./CustomeBtn";
import {
  IconDasboard,
  Handshake,
  IconGroupsSharp,
  IconCurrencies,
} from "../assets/Icons/IconsSvg";


export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: "currencies", label: "Currencies", path: "/currencies", icon: <IconCurrencies />},
    { id: "vendors", label: "Vendors", path: "/vendors", icon: <Handshake />},
    { id: "vendorGroups", label: "Vendor Groups", path: "/vendor-groups", icon: <IconGroupsSharp />}
  ];

  return (
    <aside className="bg-white shadow-lg w-50 h-screen border-r border-gray-300">
      <div className="flex items-center gap-2 p-4 border-b">
        <IconDasboard className="w-6 h-6 text-teal-600" />
        <span className="text-xl font-bold text-teal-600">Tenders</span>
      </div>

      <nav className="p-4 flex-1 fixed">
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
                        ? "bg-blue-50 text-teal-600 font-medium hover:bg-blue-50 border-none"
                        : "text-gray-700 hover:bg-gray-50 border-none"
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
