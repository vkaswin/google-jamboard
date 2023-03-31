import { lazy } from "react";
import { RouteObject, Navigate, useRoutes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { cookie } from "@/utils";

let Document = lazy(() => import("@/pages/Document"));
let DocumentList = lazy(() => import("@/pages/DocumentList"));
let AuthLayout = lazy(() => import(`@/layouts/AuthLayout`));
let SignIn = lazy(() => import("@/pages/SignIn"));
let SignUp = lazy(() => import("@/pages/SignUp"));

let routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <Navigate
        to={cookie.get("auth_token") ? "/document/list" : "/auth/sign-in"}
        replace
      />
    ),
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "sign-in",
        element: (
          <ProtectedRoute requireAuth={false}>
            <SignIn />
          </ProtectedRoute>
        ),
      },
      {
        path: "sign-up",
        element: (
          <ProtectedRoute requireAuth={false}>
            <SignUp />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/document/list",
    element: (
      <ProtectedRoute>
        <DocumentList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/document/:documentId",
    element: (
      <ProtectedRoute>
        <Document />
      </ProtectedRoute>
    ),
  },
];

const Router = () => {
  return useRoutes(routes);
};

export default Router;
