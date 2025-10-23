import ErrorPage from "@/pages/Error404";
import { RouteObject } from "react-router-dom";
import RequireAdmin from "@/Router/guards/RequireAdmin";
import PeliculasAdmin from "@/pages/admin/PeliculasAdmin";

export const adminRoutes: RouteObject[] = [
  {
    path: 'admin',
    element: (
      <RequireAdmin>
        <PeliculasAdmin />
      </RequireAdmin>
    ),
    errorElement: <ErrorPage />
  },
];

