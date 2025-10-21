import { useNavigate, useLocation } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LogOut, User2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { RoutesPaths } from "@/Router/config/routesPaths";

const useSession = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [name, setName] = useState<string>(localStorage.getItem("userName") ?? "Invitad@");

  useEffect(() => {
    const updateSession = () => {
      setToken(localStorage.getItem("token"));
      setName(localStorage.getItem("userName") ?? "Invitad@");
    };
    window.addEventListener("storage", updateSession);
    window.addEventListener("session-updated", updateSession);
    return () => {
      window.removeEventListener("storage", updateSession);
      window.removeEventListener("session-updated", updateSession);
    };
  }, []);

  const isAuth = Boolean(token);
  const initials = useMemo(() => {
    const parts = (name || "").split(" ").filter(Boolean);
    return (parts[0]?.[0] ?? "U").toUpperCase() + (parts[1]?.[0] ?? "").toUpperCase();
  }, [name]);

  return { isAuth, name, initials };
};

export default function SiteHeader() {
  const { isAuth, name, initials } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ helper: detecta ruta activa (soporta subrutas)
  const isActive = (to: string) => {
    const path = location.pathname;
    if (to === RoutesPaths.home) return path === RoutesPaths.home;
    return path === to || path.startsWith(to + "/");
  };

  // ✅ clases para nav: azul cuando está activo
  const navItemClass = (to: string) =>
    `transition-colors hover:text-[#007AFF] ${
      isActive(to) ? "text-[#007AFF] font-semibold" : "text-white/90"
    }`;

  // navegación + scroll top suave siempre
  const goTo = (to: string, replace = false) => {
    if (location.pathname !== to) {
      navigate(to, { replace });
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goHome = () => goTo(RoutesPaths.home);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    window.dispatchEvent(new Event("session-updated"));
    goTo(RoutesPaths.home, true);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-20 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <button onClick={goHome} className="flex items-center gap-2">
              <span className="text-2xl font-extrabold tracking-wide">
                <span className="text-[#007AFF]">AWS</span>CineBox
              </span>
            </button>

            {/* Nav desktop */}
            <nav className="hidden md:flex items-center gap-8 text-sm">
              <button
                onClick={() => goTo(RoutesPaths.home)}
                className={navItemClass(RoutesPaths.home)}
                aria-current={isActive(RoutesPaths.home) ? "page" : undefined}
              >
                Inicio
              </button>
              <button
                onClick={() => goTo(RoutesPaths.movies)}
                className={navItemClass(RoutesPaths.movies)}
                aria-current={isActive(RoutesPaths.movies) ? "page" : undefined}
              >
                Películas
              </button>
              <button
                onClick={() => goTo(RoutesPaths.categories)}
                className={navItemClass(RoutesPaths.categories)}
                aria-current={isActive(RoutesPaths.categories) ? "page" : undefined}
              >
                Categorías
              </button>
              <button
                onClick={() => goTo(RoutesPaths.news)}
                className={navItemClass(RoutesPaths.news)}
                aria-current={isActive(RoutesPaths.news) ? "page" : undefined}
              >
                Noticias
              </button>
            </nav>

            {/* Cuenta/Login */}
            <div className="flex items-center gap-2">
              {isAuth ? (
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 hover:bg-white/15">
                      <div className="grid h-8 w-8 place-content-center rounded-full bg-[#007AFF] text-black font-bold">
                        {initials}
                      </div>
                      <span className="hidden sm:block text-sm">{name}</span>
                    </button>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      sideOffset={8}
                      className="min-w-[180px] rounded-lg border border-white/10 bg-black/90 p-2 text-sm shadow-xl backdrop-blur-md"
                    >
                      <DropdownMenu.Item
                        onClick={() => goTo("/profile")}
                        className="flex items-center gap-2 rounded-md px-3 py-2 cursor-pointer outline-none hover:bg-white/10"
                      >
                        <User2 size={16} /> Mi cuenta
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        onClick={handleLogout}
                        className="flex items-center gap-2 rounded-md px-3 py-2 cursor-pointer outline-none hover:bg-white/10"
                      >
                        <LogOut size={16} /> Cerrar sesión
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goTo(RoutesPaths.login)}
                    className="rounded-full border border-white/20 px-3 py-1 text-xs sm:text-sm sm:px-4 sm:py-1.5 hover:bg-white/10"
                  >
                    Iniciar sesión
                  </button>
                  <button
                    onClick={() => goTo(RoutesPaths.register)}
                    className="rounded-full bg-[#007AFF] px-3 py-1 text-xs sm:text-sm sm:px-4 sm:py-1.5 font-medium text-black hover:brightness-110"
                  >
                    Registrarse
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Menú móvil */}
      <nav className="fixed top-16 inset-x-0 z-20 md:hidden bg-black/60 backdrop-blur border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-2 flex flex-wrap gap-4 text-sm">
          <button
            onClick={() => goTo(RoutesPaths.home)}
            className={navItemClass(RoutesPaths.home)}
            aria-current={isActive(RoutesPaths.home) ? "page" : undefined}
          >
            Inicio
          </button>
          <button
            onClick={() => goTo(RoutesPaths.movies)}
            className={navItemClass(RoutesPaths.movies)}
            aria-current={isActive(RoutesPaths.movies) ? "page" : undefined}
          >
            Películas
          </button>
          <button
            onClick={() => goTo(RoutesPaths.categories)}
            className={navItemClass(RoutesPaths.categories)}
            aria-current={isActive(RoutesPaths.categories) ? "page" : undefined}
          >
            Categorías
          </button>
          <button
            onClick={() => goTo(RoutesPaths.news)}
            className={navItemClass(RoutesPaths.news)}
            aria-current={isActive(RoutesPaths.news) ? "page" : undefined}
          >
            Noticias
          </button>
        </div>
      </nav>

      {/* separadores */}
      <div className="h-16 md:h-16" />
      <div className="h-10 md:hidden" />
    </>
  );
}
