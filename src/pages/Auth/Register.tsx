import { Suspense, lazy } from "react";
import AuthShell from "@/components/auth/AuthShell";

const RegisterForm = lazy(() => import("@/components/register-form"));

export default function Page() {
  return (
    <Suspense fallback={<p className="text-white text-center mt-10">Cargando registro...</p>}>
      <AuthShell title="Crea tu cuenta" subtitle="Únete a AWSCineBox">
        <RegisterForm />
      </AuthShell>
    </Suspense>
  );
}
