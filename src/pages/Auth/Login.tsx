import { Suspense, lazy } from "react";
import AuthShell from "@/components/auth/AuthShell";

const LoginForm = lazy(() => import("@/components/login-form"));

export default function Page() {
  return (
    <Suspense fallback={<p className="text-white text-center mt-10">Cargando login...</p>}>
      <AuthShell title="Inicia sesión" subtitle="Bienvenido de nuevo a AWSCineBox">
        <div className="flex justify-center">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      </AuthShell>
    </Suspense>
  );
}
