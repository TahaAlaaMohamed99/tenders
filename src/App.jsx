import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import useConfig from "./Hooks/useConfig";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  IconError,
  IconInfo,
  IconSuccess,
  IconWarning,
} from "./assets/Icons/IconsSvg";
import PublicRoutes from "./Routes/PublicRoutes";

export default function App() {




  // Use the custom useConfig hook to fetch configuration data.
  // If the configuration has not yet been fetched (config is null),
  // display a loader component to indicate loading state.
  // Once the configuration is fetched, proceed to render the main content.
 useConfig();
   
   return (
    <Router>
      <ToastContainer
        position={"top-left"}
        autoClose={3600}
        draggable="mouse"
        hideProgressBar={true}
        newestOnTop={true}
        closeButton={false}
        rtl={false}
        pauseOnFocusLoss={false}
        pauseOnHover={true}
        icon={({ type }) => {
          switch (type) {
            case "info":
              return <IconInfo className="text-titleColor dark:text-titleColorDark" />;
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
         <PublicRoutes />
     </Router>
  );
}
