import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { RoleType } from "@/types/role";
import { RoutesPaths } from "@/Router/config/routesPaths";

interface RequireAdminProps {
  children: React.ReactNode;
}

export default function RequireAdmin({ children }: RequireAdminProps) {
  const { userRole, loading, isAuthenticated } = useAuth();

  if (loading) return <div>Cargando...</div>;

  if (!isAuthenticated) {
    return <Navigate to={RoutesPaths.login} replace />;
  }

  const allowed =
    userRole === RoleType.ADMIN || userRole === RoleType.MODERATOR;

  if (!allowed) {
    return <Navigate to={RoutesPaths.dashboard} replace />;
  }

  return children;
}
