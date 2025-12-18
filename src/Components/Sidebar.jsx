import { useNavigate, useLocation } from "react-router-dom";
import CustomeBtn from "./CustomeBtn";
import {
  IconDasboard,
  Handshake,
  IconGroupsSharp,
  IconCurrencies,
  LogoName,
} from "../assets/Icons/IconsSvg";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const menuItems = [
    {
      id: "currencies",
      label: "Currencies",
      path: "/currencies",
      icon: <IconCurrencies />,
    },
    { id: "vendors", label: "Vendors", path: "/vendors", icon: <Handshake /> },
    {
      id: "vendorGroups",
      label: "Vendor Groups",
      path: "/vendor-groups",
      icon: <IconGroupsSharp />,
    },
  ];

  return (
    <aside className="bg-white shadow-lg w-64 h-screen rounded-2xl">
      <div className="flex items-center gap-2 p-4 border-b">
        <LogoName className="w-40" />
      </div>

      <nav className="p-4 flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              location.pathname === item.path + "/*" ||
              location.pathname.startsWith(item.path + "/");

            return (
              <li key={item.id}>
                <CustomeBtn
                  type="button"
                  title={item.label}
                  icon={item.icon}
                  ResourcePage="Sidebar"
                  size="btn_lg"
                  onClick={() => navigate(item.path)}
                  className={`
                    w-full justify-start gap-3 px-4 py-3
                    ${
                      isActive
                        ? "bg-blue-50 text-teal-600 font-bold !text-base hover:bg-blue-50 border-none"
                        : "text-gray-700 hover:bg-gray-50 border-none font-bold !text-base"
                    }
                  `}
                />
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 mt-auto">
        <CustomeBtn
          type="button"
          title="Logout"
          ResourcePage="Sidebar"
          size="btn_md"
          onClick={handleLogout}
          className="w-full justify-start gap-3 px-4 py-3 text-red-600 hover:bg-red-50 border-none"
        />
      </div>
    </aside>
  );
}
