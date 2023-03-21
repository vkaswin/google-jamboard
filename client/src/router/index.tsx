import { lazy } from "react";
import { RouteObject, Navigate, useRoutes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

let Document = lazy(
  () => import(/* webpackChunkName: "[Document]" */ "@/pages/Document")
);

let AuthLayout = lazy(
  () => import(/* webpackChunkName: "[AuthLayout]" */ `@/layouts/AuthLayout`)
);

let SignIn = lazy(
  () => import(/* webpackChunkName: "[SignIn]" */ "@/pages/SignIn")
);

let SignUp = lazy(
  () => import(/* webpackChunkName: "[SignUp]" */ "@/pages/SignUp")
);

let routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/document/64106505659e51ce8d788753" replace />,
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
