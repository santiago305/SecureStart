import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FieldError from "./ui/FieldError";
import { fullRegisterSchema } from "@/schemas/authSchemas";
import { fullRegisterCredentials } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";
import { useFlashMessage } from "@/hooks/useFlashMessage";
import { errorResponse, successResponse } from "@/common/utils/response";
import { RoutesPaths } from "@/router/config/routesPaths";
import { useNavigate, Link } from "react-router-dom";

function RegisterForm({ className, ...props }: React.ComponentProps<"div">) {
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwd, setPwd] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { clientUserRegister } = useAuth();
  const { showFlash, clearFlash } = useFlashMessage();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<fullRegisterCredentials>({
    resolver: zodResolver(fullRegisterSchema),
  });

  // Cálculo simple de entropía
  const entropy = useMemo(() => {
    let pool = 0;
    if (/[a-z]/.test(pwd)) pool += 26;
    if (/[A-Z]/.test(pwd)) pool += 26;
    if (/\d/.test(pwd)) pool += 10;
    if (/[^A-Za-z0-9]/.test(pwd)) pool += 33;
    return pwd.length * Math.log2(pool || 1);
  }, [pwd]);

  const level =
    entropy < 28
      ? { label: "Muy débil", color: "bg-red-500", pct: "20%" }
      : entropy < 36
      ? { label: "Débil", color: "bg-orange-500", pct: "40%" }
      : entropy < 60
      ? { label: "Media", color: "bg-yellow-500", pct: "65%" }
      : entropy < 80
      ? { label: "Fuerte", color: "bg-green-500", pct: "85%" }
      : { label: "Muy fuerte", color: "bg-emerald-500", pct: "100%" };

  const onSubmit = async (data: fullRegisterCredentials) => {
    clearFlash();
    setSubmitting(true);
    try {
      const res = await clientUserRegister(data);
      if (res.success) {
        showFlash(successResponse("Cuenta creada con éxito"));
        navigate(RoutesPaths.home);
      } else {
        showFlash(errorResponse(res.message));
      }
    } catch {
      showFlash(errorResponse("Error al registrar usuario"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-black/60 border-white/10 text-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            Regístrate
          </CardTitle>
          <CardDescription className="text-center text-white/70">
            Crea tu cuenta y forma parte de AWSCineBox
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              {/* Nombre */}
              <div className="grid gap-1">
                <Label htmlFor="name">Nombre completo</Label>
                <Input
                  id="name"
                  placeholder="Nombres Apellidos"
                  {...register("name")}
                  className="bg-black/40 border-white/10 text-white placeholder:text-white/40"
                />
                <FieldError error={errors.name?.message} />
              </div>

              {/* Email */}
              <div className="grid gap-1">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@edominio.com"
                  {...register("email")}
                  className="bg-black/40 border-white/10 text-white placeholder:text-white/40"
                />
                <FieldError error={errors.email?.message} />
              </div>

              {/* Contraseña */}
              <div className="grid gap-1">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPwd ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    onChange={(e) => setPwd(e.target.value)}
                    className="pr-10 bg-black/40 border-white/10 text-white placeholder:text-white/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="absolute inset-y-0 right-2 grid place-content-center px-2 text-white/70 hover:text-white"
                    aria-label={showPwd ? "Ocultar contraseña" : "Ver contraseña"}
                  >
                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <FieldError error={errors.password?.message} />

                {/* Barra de entropía */}
                {pwd && (
                  <div className="mt-1 space-y-1">
                    <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full ${level.color} transition-all`}
                        style={{ width: level.pct }}
                      />
                    </div>
                    <p className="text-xs text-white/70">
                      Seguridad: {level.label} ({Math.round(entropy)} bits)
                    </p>
                  </div>
                )}
              </div>

              {/* Confirmación */}
              <div className="grid gap-1">
                <Label htmlFor="passwordConfirm">Confirmar contraseña</Label>
                <div className="relative">
                  <Input
                    id="passwordConfirm"
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("passwordConfirm")}
                    className="pr-10 bg-black/40 border-white/10 text-white placeholder:text-white/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute inset-y-0 right-2 grid place-content-center px-2 text-white/70 hover:text-white"
                    aria-label={showConfirm ? "Ocultar contraseña" : "Ver contraseña"}
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <FieldError error={errors.passwordConfirm?.message} />
              </div>

              {/* Botón azul estilo vestido Brave */}
              <Button
                type="submit"
                className="w-full bg-[#1565C0] hover:bg-[#1E88E5] text-white transition-colors"
                disabled={submitting}
              >
                {submitting ? "Cargando..." : "Registrarme"}
              </Button>

              {/* Enlace al login */}
              <div className="text-center text-sm text-white/80 mt-2">
                ¿Ya tienes una cuenta?{" "}
                <Link to={RoutesPaths.login} className="underline underline-offset-4">
                  Inicia sesión
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default RegisterForm;
