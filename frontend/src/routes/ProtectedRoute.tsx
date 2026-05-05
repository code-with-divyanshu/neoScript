import { Navigate, Outlet } from "react-router-dom";
import { useStore } from "../lib/store";

export const ProtectedRoute = () => {
  const { isAuthenticated } = useStore((state) => state);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
