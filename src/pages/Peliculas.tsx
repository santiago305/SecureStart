import { useEffect, useMemo, useState } from "react";
import { Search, Delete, CornerDownLeft, Star } from "lucide-react";
import { Link } from "react-router-dom";
import ShimmerLoader from "@/components/loadings.tsx/ShimmerLoader";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { listPeliculas } from "@/services/peliculasService";
import { RoutesPaths } from "@/Router/config/routesPaths";

type Movie = {
  id: string;
  titulo: string;
  descripcion?: string | null;
  duracion_minutos?: number | null;
  idioma?: string | null;
  rating?: number | null;
  poster_url?: string | null;
  trailer_url?: string | null;
};

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Fila por fila como un teclado QWERTY
const PC_ROWS: string[][] = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

export default function Peliculas() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await listPeliculas({ titulo: query, limit: 30, order: "DESC" });
        if (!ignore) setMovies(res.data || []);
      } catch {
        if (!ignore) setMovies([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchData();
    return () => {
      ignore = true;
    };
  }, [query]);

  const filtered = useMemo(() => movies, [query, movies]);

  const handleKeyClick = (key: string) => {
    if (key === "SPACE") setQuery((q) => q + " ");
    else if (key === "DELETE") setQuery((q) => q.slice(0, -1));
    else if (key === "ENTER") return;
    else setQuery((q) => q + key);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader />
      <div className="h-16" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="py-6">
          <h1 className="text-2xl font-bold">
            <span className="text-[#007AFF]">AWS</span>CineBox · Películas
          </h1>
        </div>

        {/* PANEL SUPERIOR */}
        <div className="sticky top-16 z-10 mb-6 rounded-xl bg-white/5 p-3 ring-1 ring-white/10 backdrop-blur supports-[backdrop-filter]:bg-black/30">
          <h3 className="mb-3 text-sm font-semibold text-white/80">
            Buscar película (teclado virtual)
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

          {/* === TECLADO QWERTY (Desktop) === */}
          <div className="hidden sm:block">
            <div className="mx-auto max-w-3xl space-y-2">
              {PC_ROWS.map((row, idx) => (
                <div key={idx} className="flex justify-center gap-2">
                  {row.map((k) => (
                    <button
                      key={k}
                      onClick={() => handleKeyClick(k)}
                      className="rounded-md bg-white/10 px-3 py-1.5 text-sm font-semibold hover:bg-white/20 transition-all"
                    >
                      {k}
                    </button>
                  ))}
                </div>
              ))}

              {/* Controles */}
              <div className="flex justify-center items-center gap-2 pt-2">
                <button
                  onClick={() => handleKeyClick("SPACE")}
                  className="min-w-[180px] rounded-md bg-white/10 py-1.5 text-sm hover:bg-white/20"
                >
                  Espacio
                </button>
                <button
                  onClick={() => handleKeyClick("DELETE")}
                  className="rounded-md bg-white/10 px-3 py-1.5 flex justify-center hover:bg-white/20"
                  aria-label="Borrar"
                >
                  <Delete size={16} />
                </button>
                <button
                  onClick={() => handleKeyClick("ENTER")}
                  className="rounded-md bg-[#007AFF]/80 px-3 py-1.5 flex justify-center hover:bg-[#007AFF]"
                  aria-label="Enter"
                >
                  <CornerDownLeft size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* === TECLADO MÓVIL (Grid alfabético) === */}
          <div className="sm:hidden">
            <div className="mx-auto max-w-3xl">
              <div className="grid grid-cols-10 gap-2 text-center justify-center">
                {alphabet.map((L) => (
                  <button
                    key={L}
                    onClick={() => handleKeyClick(L)}
                    className="rounded-md bg-white/10 px-2 py-1.5 text-sm font-semibold hover:bg-white/20 transition-all"
                  >
                    {L}
                  </button>
                ))}

                {/* Espacio, borrar, enter */}
                <button
                  onClick={() => handleKeyClick("SPACE")}
                  className="col-span-2 rounded-md bg-white/10 py-1.5 text-sm hover:bg-white/20"
                >
                  Espacio
                </button>
                <button
                  onClick={() => handleKeyClick("DELETE")}
                  className="rounded-md bg-white/10 py-1.5 flex justify-center hover:bg-white/20"
                  aria-label="Borrar"
                >
                  <Delete size={14} />
                </button>
                <button
                  onClick={() => handleKeyClick("ENTER")}
                  className="rounded-md bg-[#007AFF]/80 py-1.5 flex justify-center hover:bg-[#007AFF]"
                  aria-label="Enter"
                >
                  <CornerDownLeft size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* === LISTA DE PELÍCULAS === */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {loading &&
            Array.from({ length: 12 }).map((_, idx) => (
              <article
                key={`loader-${idx}`}
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
                to={RoutesPaths.movieDetail(m.id)} // 👈 lleva al detalle con el video
                className="group rounded-xl bg-white/5 p-2 ring-1 ring-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-white/10">
                  {m.poster_url ? (
                    <img
                      src={m.poster_url}
                      alt={m.titulo}
                      className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <ShimmerLoader />
                  )}

                  {typeof m.rating === "number" && (
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-yellow-400 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                      <Star size={12} fill="currentColor" /> {m.rating.toFixed(1)}
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <h3 className="line-clamp-1 text-sm font-medium">{m.titulo}</h3>
                  <p className="text-xs text-white/60">
                    {m.duracion_minutos ?? "?"} min{" "}
                    {m.idioma ? `· ${m.idioma.toUpperCase()}` : ""}
                  </p>
                </div>
              </Link>
            ))}

          {!loading && filtered.length === 0 && (
            <div className="col-span-full text-sm text-white/60">
              Sin resultados para “{query}”.
            </div>
          )}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
