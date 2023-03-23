import { Fragment, ReactNode } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { cookie } from "@/utils";

type ProtectedRouteProps = {
  children: ReactNode;
  requireAuth?: boolean;
};

let authPages = ["/auth/sign-in", "/auth/sign-up"];

const ProtectedRoute = ({
  children,
  requireAuth = true,
}: ProtectedRouteProps) => {
  let authToken = cookie.get("auth_token");

  const { pathname } = useLocation();

  if (authToken && authPages.includes(pathname))
    return <Navigate replace to="/document/64106505659e51ce8d788753" />;

  if (requireAuth && !authToken) return <Navigate replace to="/auth/sign-in" />;

  return <Fragment>{children}</Fragment>;
};

export default ProtectedRoute;