import { AuthContext } from "./AuthContext";
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLogged } = useContext(AuthContext);
  const location = useLocation();
    
  if (!isLogged) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;