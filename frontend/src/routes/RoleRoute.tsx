import { Navigate, Outlet } from "react-router-dom";
import { useStore } from "../lib/store";

type Role = "reader" | "author" | "admin";

export const RoleRoute = ({ allowedRoles }: { allowedRoles: Role[] }) => {
  const { isAuthenticated, user } = useStore((state) => state);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
