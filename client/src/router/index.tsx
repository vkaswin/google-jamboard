import { lazy, Suspense } from "react";
import { useRoutes, RouteObject, Navigate } from "react-router-dom";

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
    element: (
      <Suspense fallback="Loading...">
        <AuthLayout />
      </Suspense>
    ),
    children: [
      {
        path: "sign-in",
        element: (
          <Suspense fallback="Loading...">
            <SignIn />
          </Suspense>
        ),
      },
      {
        path: "sign-up",
        element: (
          <Suspense fallback="Loading...">
            <SignUp />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/document/:id",
    element: (
      <Suspense fallback="Loading...">
        <Document />
      </Suspense>
    ),
  },
];

const Routes = () => {
  return useRoutes(routes);
};

export default Routes;
