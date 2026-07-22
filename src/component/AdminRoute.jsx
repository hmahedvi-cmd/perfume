import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute({ children }) {
  const { user, isAdmin } = useAuth();

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;
