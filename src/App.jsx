import { BrowserRouter as Router,Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useConfig from "./Hooks/useConfig";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  IconError,
  IconInfo,
  IconSuccess,
  IconWarning,
} from "./assets/Icons/IconsSvg";
import { AuthProvider, useAuth } from "./context/AuthContext";
import PrivateRoute from "./Routes/PrivateRoute";
import Login from "./Pages/Login";
import DynamicRouter from "./Routes/DynamicRouter";
import { useTheme } from "./Hooks/useTheme";

function AppContent() {
  const { isAuthenticated } = useAuth();
  useConfig();
  useTheme();
  const { currentLanguage } = useSelector((state) => state.themeSlice);

  return (
    <>
      <ToastContainer
        position={currentLanguage === 'ar' ? "top-right" : "top-left"}
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

      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
        />

        <Route
          path="/*"
          element={
            <PrivateRoute>
              <DynamicRouter />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
