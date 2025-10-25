import { useNavigate, useLocation } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LogOut, User2 } from "lucide-react";
import { useMemo } from "react";
import { RoutesPaths } from "@/Router/config/routesPaths";
import { useAuth } from "@/hooks/useAuth";

export default function SiteHeader() {
  const { isAuthenticated, userName, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (to: string) => {
    const path = location.pathname;
    if (to === RoutesPaths.home) return path === RoutesPaths.home;
    return path === to || path.startsWith(to + "/");
  };

  const navItemClass = (to: string) =>
    `transition-colors hover:text-[#7B61FF] ${
      isActive(to) ? "text-[#7B61FF] font-semibold" : "text-white/90"
    }`;

  const goTo = (to: string, replace = false) => {
    if (location.pathname !== to) {
      navigate(to, { replace });
      requestAnimationFrame(() =>
        window.scrollTo({ top: 0, behavior: "smooth" })
      );
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goHome = () => goTo(RoutesPaths.home);

  const initials = useMemo(() => {
    const parts = (userName || "Invitad@").split(" ").filter(Boolean);
    return (
      (parts[0]?.[0] ?? "U").toUpperCase() +
      (parts[1]?.[0] ?? "").toUpperCase()
    );
  }, [userName]);

  const handleLogout = () => {
    logout();
    goTo(RoutesPaths.home, true);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-20 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* 🔵 Logo con degradado */}
            <button onClick={goHome} className="flex items-center gap-2">
              <span className="text-2xl font-extrabold tracking-wide">
                <span className="bg-gradient-to-r from-[#00C6FF] to-[#7B61FF] bg-clip-text text-transparent">
                  AWS
                </span>
                <span className="text-white">CineBox</span>
              </span>
            </button>

            {/* 🌐 Nav desktop */}
            <nav className="hidden md:flex items-center gap-8 text-sm">
              <button onClick={() => goTo(RoutesPaths.home)} className={navItemClass(RoutesPaths.home)}>
                Inicio
              </button>
              <button onClick={() => goTo(RoutesPaths.movies)} className={navItemClass(RoutesPaths.movies)}>
                Películas
              </button>
              <button onClick={() => goTo(RoutesPaths.categories)} className={navItemClass(RoutesPaths.categories)}>
                Categorías
              </button>
              <button onClick={() => goTo(RoutesPaths.news)} className={navItemClass(RoutesPaths.news)}>
                Noticias
              </button>
            </nav>

            {/* 👤 Cuenta/Login */}
            <div className="flex items-center gap-2">
              {isAuthenticated && (userRole === "admin" || userRole === "moderator") && (
                <a
                  href={RoutesPaths.dashboardAdmin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex rounded-full bg-[#7B61FF] px-3 py-1.5 text-xs sm:text-sm font-semibold text-black hover:brightness-110"
                >
                  Panel Admin
                </a>
              )}

              {isAuthenticated ? (
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 hover:bg-white/15">
                      <div className="grid h-8 w-8 place-content-center rounded-full bg-gradient-to-r from-[#00C6FF] to-[#7B61FF] text-black font-bold">
                        {initials}
                      </div>
                      <span className="hidden sm:block text-sm">{userName ?? "Invitad@"}</span>
                    </button>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      sideOffset={8}
                      className="min-w-[180px] rounded-lg border border-white/10 bg-black/90 p-2 text-sm shadow-xl backdrop-blur-md"
                    >
                      <DropdownMenu.Item
                        onClick={() => goTo("/perfil")}
                        className="flex items-center gap-2 rounded-md px-3 py-2 cursor-pointer outline-none hover:bg-white/10 text-white"
                      >
                        <User2 size={16} /> Mi cuenta
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        onClick={handleLogout}
                        className="flex items-center gap-2 rounded-md px-3 py-2 cursor-pointer outline-none hover:bg-white/10 text-white"
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
                    className="rounded-full bg-gradient-to-r from-[#00C6FF] to-[#7B61FF] px-3 py-1 text-xs sm:text-sm sm:px-4 sm:py-1.5 font-medium text-black hover:brightness-110"
                  >
                    Registrarse
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 📱 Menú móvil: centrado en una sola línea */}
      <nav className="fixed top-16 inset-x-0 z-20 md:hidden bg-black/60 backdrop-blur border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-3 flex justify-center items-center gap-6 text-sm text-center">
          <button onClick={() => goTo(RoutesPaths.home)} className={navItemClass(RoutesPaths.home)}>
            Inicio
          </button>
          <button onClick={() => goTo(RoutesPaths.movies)} className={navItemClass(RoutesPaths.movies)}>
            Películas
          </button>
          <button onClick={() => goTo(RoutesPaths.categories)} className={navItemClass(RoutesPaths.categories)}>
            Categorías
          </button>
          <button onClick={() => goTo(RoutesPaths.news)} className={navItemClass(RoutesPaths.news)}>
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
