import DocumentList from "@/pages/DocumentList";
import { lazy } from "react";
import { RouteObject, Navigate, useRoutes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

let Document = lazy(() => import("@/pages/Document"));
let AuthLayout = lazy(() => import(`@/layouts/AuthLayout`));
let SignIn = lazy(() => import("@/pages/SignIn"));
let SignUp = lazy(() => import("@/pages/SignUp"));

let routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/document/6422c4dd76c7ef0eaa9aca75" replace />,
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
