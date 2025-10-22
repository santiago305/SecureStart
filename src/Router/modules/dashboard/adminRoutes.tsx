import ErrorPage from "@/pages/Error404";
import { RouteObject } from "react-router-dom";
import AdminPanel from "@/pages/admin/AdminPanel";


export const adminRoutes: RouteObject[] = [
  {
    path: 'admin',
    element: (
        <AdminPanel />
    ),
    errorElement: <ErrorPage />
  },
];

