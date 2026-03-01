import { BrowserRouter as Router } from "react-router-dom";
import { useSelector } from "react-redux";
import useConfig from "./Hooks/useConfig";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  IconError,
  IconInfo,
  IconSuccess,
  IconWarning,
} from "./assets/Icons";
import { useTheme } from "./Hooks/useTheme";
import AppTooltip from "./Components/AppTooltip";
import DynamicRouter from "./Routes/DynamicRouter";
import PublicRoutes from "./Routes/PublicRoutes";

function AppContent() {
  useConfig();
  useTheme();
  const { currentLanguage } = useSelector((state) => state.themeSlice);
  
  const userToken = localStorage.getItem("userToken");

  return (
    <>
      <ToastContainer
        position={currentLanguage === 'ar' ? "top-left" : "top-right"}
        autoClose={3600}
        draggable="mouse"
        hideProgressBar={true}
        newestOnTop={true}
        closeButton={false}
        rtl={currentLanguage === 'ar'}
        pauseOnFocusLoss={false}
        pauseOnHover={true}
        icon={({ type }) => {
          switch (type) {
            case "info":
              return (
                <IconInfo className="text-titleColor dark:text-titleColorDark" />
              );
            case "error":
              return <IconError className="text-errorDark" />;
            case "success":
              return <IconSuccess className="text-success" />;
            case "warning":
              return <IconWarning className="text-warning" />;
            default:
              return null;
          }
        }}
      />
      <AppTooltip />

      {userToken ? <DynamicRouter /> : <PublicRoutes />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
