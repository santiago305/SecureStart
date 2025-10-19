import { useState } from "react";
import { parseApiError } from "@/common/utils/handleApiError";
import { flashMessage } from "@/common/utils/flashEvent";
import { useAuth } from "@/hooks/useAuth";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { login: ctxLogin } = useAuth();

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await ctxLogin({ email, password });
      if (res.success) {
        flashMessage("success", "Inicio de sesión exitoso");
        return true;
      } else {
        flashMessage("error", res.message || "Error al iniciar sesión.");
        return false;
      }
    } catch (error) {
      const msg = parseApiError(error, "Error al iniciar sesión.");
      flashMessage("error", msg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};
