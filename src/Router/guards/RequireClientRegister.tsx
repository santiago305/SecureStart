import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { PropsUrl } from "@/Router/guards/typeGuards";
import { RoleType } from "@/types/role";
import { RoutesPaths } from "../config/routesPaths";

/**
 * Guardián de Rutas para Registro de Clientes.
 * 
 * Este guard se encarga de restringir el acceso a rutas de registro de clientes 
 * únicamente a usuarios autenticados con rol `USER` que aún no hayan completado su registro como cliente.
 * 
 * - Si el usuario no está autenticado, es redirigido al Login.
 * - Si el usuario no tiene el rol `USER`, es redirigido al Home.
 * - Si el usuario ya completó el registro de cliente, es redirigido al Home.
 * - Si cumple con todas las condiciones, se permite acceder a la ruta protegida.
 * 
 * @param {PropsUrl} children - Componente o grupo de componentes a renderizar si se cumplen las condiciones.
 * @returns {JSX.Element} El componente protegido o una redirección controlada.
 * 
 * @example
 * <RequireClientRegister>
 *   <ClientsRegister />
 * </RequireClientRegister>
 */
const RequireClientRegister = ({ children }: PropsUrl) => {
  const { isAuthenticated, userRole, hasClient, loading } = useAuth();

  if (loading) return <div className="text-center p-4">Guard de clients register...</div>;


  if (!isAuthenticated)   return <Navigate to={RoutesPaths.login} replace />;


  if (userRole !== RoleType.USER) return <Navigate to={RoutesPaths.home} replace />;


  if (userRole === RoleType.USER && hasClient) return <Navigate to={RoutesPaths.home} replace />;
  

  return children;
};

export default RequireClientRegister;
