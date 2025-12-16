import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "../Components/loader";

export default function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
