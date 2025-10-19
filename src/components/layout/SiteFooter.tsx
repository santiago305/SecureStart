import { Link } from "react-router-dom";
import { RoutesPaths } from "@/router/config/routesPaths";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black/60 py-10">
      <div className="mx-auto max-w-7xl px-4 text-sm text-white/70 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="font-semibold">
            <span className="text-[#007AFF]">AWS</span>CineBox
          </button>
          <nav className="flex gap-6">
            <Link to={RoutesPaths.home} className="hover:text-white">Inicio</Link>
            <Link to={RoutesPaths.movies} className="hover:text-white">Películas</Link>
            <Link to={RoutesPaths.categories} className="hover:text-white">Categorías</Link>
            <Link to={RoutesPaths.news} className="hover:text-white">Noticias</Link>
          </nav>
          <span>© {new Date().getFullYear()} AWS CineBox. Todos los derechos reservados.</span>
        </div>
      </div>
    </footer>
  );
}
