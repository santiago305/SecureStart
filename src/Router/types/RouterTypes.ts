/**
 * Metadata de las rutas de la aplicación para control de navegación y permisos.
 */
export interface RouteMetadata {
  path: string;
  name: string;
  isPublic?: boolean;               // Ruta pública accesible sin autenticación
  isAuthRoute?: boolean;            // Ruta de login o registro
  isProtected?: boolean;            // Ruta protegida (requiere autenticación)
  requiresClientRegister?: boolean; // Ruta para usuarios que no han completado su registro de cliente
  rolesAllowed?: string[];          // Roles permitidos para acceder (futuro control de roles)
}