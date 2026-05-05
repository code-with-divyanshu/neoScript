import { Navigate, Outlet } from "react-router-dom";
import { useStore } from "../lib/store";

export const PublicRoute = () => {
  const { isAuthenticated } = useStore((state) => state);

  // If already logged in, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // If not logged in, show the login/signup page
  return <Outlet />;
};
