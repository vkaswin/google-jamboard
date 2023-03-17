import { Fragment, ReactNode } from "react";
import { useLocation, Navigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

type ProtectedRouteProps = {
  children: ReactNode;
  requireAuth?: boolean;
};

let authPages = ["/auth/sign-in", "/auth/sign-up"];

const ProtectedRoute = ({
  children,
  requireAuth = true,
}: ProtectedRouteProps) => {
  const { user } = useAuth();

  const { pathname } = useLocation();

  if (user && authPages.includes(pathname))
    return <Navigate replace to="/document/64106505659e51ce8d788753" />;

  if (requireAuth && !user) return <Navigate replace to="/auth/sign-in" />;

  return <Fragment>{children}</Fragment>;
};

export default ProtectedRoute;
