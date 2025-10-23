import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { PropsUrl } from "@/Router/guards/typeGuards";
import { RoleType } from "@/types/role";
import { RoutesPaths } from "../config/routesPaths";

const RequireAdmin = ({ children }: PropsUrl) => {
  const { userRole, loading, isAuthenticated } = useAuth();

  if (loading) return <div>Cargando...</div>;
  if (!isAuthenticated) return <Navigate to={RoutesPaths.login} replace />;

  const allowed = userRole === RoleType.ADMIN || userRole === RoleType.MODERATOR;
  if (!allowed) return <Navigate to={RoutesPaths.dashboard} replace />;

  return children;
};

export default RequireAdmin;
