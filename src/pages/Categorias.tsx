import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import ShimmerLoader from "@/components/loadings.tsx/ShimmerLoader";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { listPeliculas } from "@/services/peliculasService";
import { RoutesPaths } from "@/Router/config/routesPaths";

type Pelicula = {
  id: string;
  titulo: string;
  duracion_minutos: number | null;
  idioma: string | null;
  rating?: number | null;
  generos?: string[] | null;
  poster_url?: string | null;
};

const GENRES = [
  "ACCIÓN",
  "DRAMA",
  "COMEDIA",
  "FANTASÍA",
  "TERROR",
  "CIENCIA FICCIÓN",
  "ROMÁNTICAS",
  "ANIMACIÓN",
];

export default function Categorias() {
  // Scroll top al entrar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const [query, setQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const [movies, setMovies] = useState<Pelicula[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar películas filtradas desde backend
  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        setLoading(true);
        const res = await listPeliculas({
          titulo: query.trim() || undefined,
          limit: 60,
          order: "DESC",
        });
        if (!ignore) setMovies(res.data || []);
      } catch {
        if (!ignore) setMovies([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => { ignore = true; };
  }, [query]);

  // Filtrado local por género
  const filtered = movies.filter((m) => {
    if (!activeGenre) return true;
    const genres = (m.generos || []).map((g) => g.toUpperCase());
    return genres.includes(activeGenre);
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader />
      <div className="h-16" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="py-6">
          <h1 className="text-2xl font-bold">
            <span className="text-[#007AFF]">AWS</span>CineBox · Categorías
          </h1>
        </div>

        {/* Panel superior: búsqueda + filtros */}
        <div className="sticky top-16 z-10 mb-6 rounded-xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur supports-[backdrop-filter]:bg-black/30">
          <h3 className="mb-3 text-sm font-semibold text-white/80">
            Buscar y filtrar por género
          </h3>

          {/* Buscador */}
          <div className="mb-4 flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
            <Search size={16} className="opacity-80" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar película"
              className="w-full bg-transparent text-sm placeholder-white/60 focus:outline-none"
            />
          </div>

          {/* Chips de géneros */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveGenre(null)}
              className={`rounded-full border border-white/15 px-3 py-1 text-xs hover:bg-white/10 transition-all ${
                activeGenre === null ? "bg-white/15" : ""
              }`}
            >
              Todos
            </button>
            {GENRES.map((g) => (
              <button
                key={g}
                onClick={() => setActiveGenre(g)}
                className={`rounded-full border border-white/15 px-3 py-1 text-xs hover:bg-white/10 transition-all ${
                  activeGenre === g ? "bg-white/15" : ""
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de películas */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {loading &&
            Array.from({ length: 12 }).map((_, i) => (
              <article
                key={`s-${i}`}
                className="group rounded-xl bg-white/5 p-2 ring-1 ring-white/10"
              >
                <div className="aspect-[2/3] w-full overflow-hidden rounded-lg bg-white/10">
                  <ShimmerLoader />
                </div>
                <div className="mt-2">
                  <div className="h-4 w-3/4 bg-white/10 rounded" />
                  <div className="mt-1 h-3 w-1/2 bg-white/10 rounded" />
                </div>
              </article>
            ))}

          {!loading &&
            filtered.map((m) => (
              <Link
                key={m.id}
                to={RoutesPaths.movieDetail(m.id)}
                className="group rounded-xl bg-white/5 p-2 ring-1 ring-white/10 hover:bg-white/10 transition-all"
              >
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-white/10">
                  {m.poster_url ? (
                    <img
                      src={m.poster_url}
                      alt={m.titulo}
                      className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <ShimmerLoader />
                  )}
                </div>

                <div className="mt-2">
                  <h3 className="line-clamp-1 text-sm font-medium">{m.titulo}</h3>
                  <p className="text-xs text-white/60">
                    {m.duracion_minutos ? `${m.duracion_minutos} min` : "—"}{" "}
                    {m.idioma ? `· ${m.idioma.toUpperCase()}` : ""}
                  </p>
                </div>
              </Link>
            ))}

          {!loading && filtered.length === 0 && (
            <div className="col-span-full text-sm text-white/60 text-center py-8">
              {activeGenre ? (
                <>
                  No hay resultados en “{activeGenre}” para “{query || "todos"}”.
                </>
              ) : (
                <>Sin resultados para “{query || "todos"}”.</>
              )}
            </div>
          )}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
