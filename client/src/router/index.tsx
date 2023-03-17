import { lazy, Suspense } from "react";
import { useRoutes, RouteObject, Navigate } from "react-router-dom";

let Document = lazy(
  () => import(/* webpackChunkName: "[Document]" */ "@/pages/Document")
);

let routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/document/64106505659e51ce8d788753" replace />,
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
