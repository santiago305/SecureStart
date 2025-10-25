import ErrorPage from "@/pages/Error404";
import { RouteObject } from "react-router-dom";
import RequireAdmin from "@/Router/guards/RequireAdmin";
import AdminPanel from "@/pages/admin/AdminPanel";

export const adminRoutes: RouteObject[] = [
  {
    path: 'admin',
    element: (
      <RequireAdmin>
        <AdminPanel />
      </RequireAdmin>
    ),
    errorElement: <ErrorPage />
  },
];
