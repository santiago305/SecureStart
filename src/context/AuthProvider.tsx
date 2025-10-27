import { useState, useEffect } from "react";
import { checkTokenValidity, loginUser, logoutUser, registerUser } from "@/services/authService";
import { LoginCredentials, RegisterCredentials } from "@/types/auth";
import { PropsUrl } from "@/Router/guards/typeGuards";
import { AuthContext } from "./AuthContext";
import { checkExistingClient } from "@/services/clientsService";
import { findOwnUser } from "@/services/userService";
import { AuthResponse } from "@/types/AuthResponse";

/**
 * Proveedor de autenticación.
 * 
 * Maneja la lógica de autenticación, almacenamiento de tokens, 
 * verificación de roles y control de estados relacionados a 
 * la sesión del usuario. 
 * 
 * @param {PropsUrl} props Contiene los elementos hijos a renderizar.
 * @returns {JSX.Element} Contexto de autenticación aplicado a los componentes hijos.
 */
export const AuthProvider = ({ children }: PropsUrl) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [hasClient, setHasClient] = useState<boolean | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Verifica la validez del token y actualiza los estados de autenticación.
   * También determina si el usuario tiene un cliente asociado (para el rol 'user').
   */
  const checkAuth = async () => {
    try {
      const valid = await checkTokenValidity();
      if (!valid) {
        setIsAuthenticated(false);
        setUserRole(null);
        setHasClient(null);
        setLoading(false); 
        return { success: false, message: "Token inválido o expirado" };
      }
      const response = await findOwnUser();
      const user = response?.data || {};
      const rawRole =
        user.role?.description?.toLowerCase() ||
        user.role?.name?.toLowerCase() ||
        user.rol?.toLowerCase() ||
        "user";

      setUserRole(rawRole);
      setUserName(user.name ?? user.user_name ?? user.username ?? null);
      setIsAuthenticated(true);
  
      if (rawRole === 'user') {
        const exists = await checkExistingClient();
        setHasClient(exists);
      } else {
        setHasClient(null);
      }

      setLoading(false);
      return { success: true, message: "Autenticación validada" };
    } catch (error: any) {
      console.error("Error en checkAuth:", error);
      setIsAuthenticated(false);
      setUserRole(null);
      setUserName(null);
      setHasClient(null);
      setLoading(false);
      const message = error.response?.data?.message || "Error inesperado en autenticación";
      return { success: false, message };
    } 
  };

  useEffect(() => {
    checkAuth();
  }, []);
  /**
   * Inicia sesión del usuario.
   * 
   * @param {LoginCredentials} payload Credenciales del usuario.
   */
  const login = async (payload: LoginCredentials): Promise<AuthResponse> => {
    try {
      const data = await loginUser(payload);

      if (data?.access_token) {
        // 🔹 Guardar token correctamente (solo el string)
        localStorage.setItem("token", data.access_token);

        await checkAuth();
        return { success: true, message: "Inicio de sesión exitoso" };
      } else {
        return { success: false, message: "No se pudo iniciar sesión" };
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Error en la autenticación";
      return { success: false, message };
    }
  };

  /**
   * Registra a un cliente como usuario.
   * 
   * @param {RegisterCredentials} payload Datos de registro.
   * @returns {Promise<boolean>} `true` si el registro fue exitoso.
   */
  const clientUserRegister = async (payload: RegisterCredentials): Promise<AuthResponse> => {
    try {
      const data = await registerUser(payload);
      if (data?.access_token) {
        // ⚡ Guardar token limpio en localStorage
        localStorage.setItem("token", data.access_token);

        await checkAuth();
        return { success: true, message: "Registro exitoso" };
      } else {
        return { success: false, message: "Error al registrar usuario" };
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Error en el registro";
      return { success: false, message };
    }
  };


  /**
   * Cierra la sesión actual del usuario.
   */
  const logout = () => {
    logoutUser()
    setIsAuthenticated(false);
    setUserRole(null);
    setUserName(null);
    setHasClient(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        hasClient,
        userName,
        login,
        clientUserRegister,
        logout,
        loading,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
