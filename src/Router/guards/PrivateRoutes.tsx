import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import PrivateRoute from "../guards/PrivateRoute";
import { RoutesPaths } from "../config/routesPaths";

const Perfil = lazy(() => import("@/pages/Perfil"));
const ErrorPage = lazy(() => import("@/pages/Error404"));

export const privateRoutes: RouteObject[] = [
  {
    path: RoutesPaths.profile,
    element: (
      <PrivateRoute>
        <Perfil />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
  },
];
