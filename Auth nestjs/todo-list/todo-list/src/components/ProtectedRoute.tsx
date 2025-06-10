import { useLocation, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();
  // If user is on a public route (login/signup) and has a token, redirect to home
  if (token && (location.pathname === "/" || location.pathname === "/signup")) {
    navigate("/home");
  }

  // If user is not authenticated and trying to access protected route
  if (!token && location.pathname !== "/" && location.pathname !== "/signup") {
    navigate("/");
  }

  return <>{children}</>;
}
