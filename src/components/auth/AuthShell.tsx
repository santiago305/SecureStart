import loginbg from "@/assets/images/loginbg.png";
import brave from "@/assets/images/Brave.png";

type AuthShellProps = {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
};

export default function AuthShell({ children, title, subtitle }: AuthShellProps) {
  return (
    <div
      className="relative w-full text-white overflow-hidden"
      style={{ height: "100vh" }}
    >
      {/* Fondo */}
      <div className="absolute inset-0">
        <img
          src={loginbg}
          alt="background"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-black/60" />
      </div>

      {/* Header alineado a la izquierda */}
      <header className="absolute top-6 left-8 z-20">
        <h1 className="text-2xl font-semibold tracking-wide">AWSCineBox</h1>
      </header>

      {/* Contenido */}
      <main className="relative z-10 grid h-full grid-cols-1 md:grid-cols-2">
        {/* Sección de formulario */}
        <div className="flex items-center justify-center p-8 md:p-16 relative">
          <div
            className="w-full max-w-md space-y-6 absolute"
            style={{
              top: "50%",
              transform: "translateY(-50%)", // 🔹 Subido un 10% extra sobre el centro
            }}
          >
            <div>
              <h2 className="text-3xl font-bold text-center">{title}</h2>
              {subtitle && (
                <p className="text-center text-white/70 mt-2">{subtitle}</p>
              )}
            </div>
            {children}
          </div>
        </div>

        {/* Imagen lateral (solo en pantallas medianas o mayores) */}
        <div className="relative hidden md:block">
          <img
            src={brave}
            alt="Brave Girl"
            className="absolute bottom-0 right-8 h-[90%] drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)] object-contain"
          />
        </div>
      </main>
    </div>
  );
}
