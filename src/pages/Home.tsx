import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Search, Play, Calendar, Star, ChevronRight, TrendingUp } from "lucide-react";
import braveHero from "@/assets/images/Brave2.jpg";
import { RoutesPaths } from "@/Router/config/routesPaths";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import ShimmerLoader from "@/components/loadings.tsx/ShimmerLoader";
import { listPeliculas } from "@/services/peliculasService";
import { listNoticias } from "@/services/noticiasService";

/** Tipado mínimo que esperamos del backend */
type Pelicula = {
  id: string;
  titulo: string;
  descripcion?: string | null;
  fecha_estreno?: string | null;
  duracion_minutos?: number | null;
  idioma?: string | null;
  rating?: number | null;
  poster_url?: string | null;
  trailer_url?: string | null;
};

type Noticia = {
  id: string;
  titulo: string;
  subtitulo?: string | null;
  imagen_url?: string | null;
  fecha?: string | null;       // en tu entidad es "fecha" (date)
  contenido?: string | null;
  rating?: number | null;
  estado?: boolean;
};

export default function Home() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const [homeQuery, setHomeQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [featured, setFeatured] = useState<Pelicula[]>([]);
  const [newReleases, setNewReleases] = useState<Pelicula[]>([]);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        setLoading(true);

        const destacadosRes = await listPeliculas({
          limit: 12,
          sortBy: "rating",
          order: "DESC",
        });

        const estrenosRes = await listPeliculas({
          titulo: homeQuery.trim() || undefined,
          limit: 12,
          sortBy: "fecha_estreno",
          order: "DESC",
        });

        if (!ignore) {
          setFeatured(destacadosRes.data || []);
          setNewReleases(estrenosRes.data || []);
        }
      } catch {
        if (!ignore) {
          setFeatured([]);
          setNewReleases([]);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [homeQuery]);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <SiteHeader />
      <div className="h-16" />

      {/* HERO */}
      <section className="relative h-[100vh] overflow-hidden -mt-16">
        {/* Fondo */}
        <img
          src={braveHero}
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />

        {/* Degradado */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />

        {/* Contenido */}
        <div className="relative z-10 max-w-3xl ml-12 sm:ml-24 pt-28 sm:pt-32">
          <div className="max-w-2xl">
            <div className="flex gap-3 mb-5">
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 animate-pulse">
                🎬 ESTRENO EXCLUSIVO
              </span>
              <span className="bg-white/10 border border-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                DISPONIBLE EN IMAX 3D
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-4">
              Vive el{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                cine
              </span>{" "}
              como nunca antes
            </h1>

            <p className="text-white/80 text-base sm:text-lg max-w-xl leading-relaxed">
              Sumérgete en historias inolvidables. Desde los blockbusters más esperados hasta los clásicos que marcaron generaciones.
            </p>

            <div className="mt-6 flex items-center gap-3 flex-wrap">
              <Link
                to={RoutesPaths.movies}
                className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 text-sm sm:text-base font-semibold text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-blue-500/30 flex items-center gap-2"
              >
                <Play size={18} fill="white" /> Ver ahora
              </Link>


              <a
                href="https://www.youtube.com/watch?v=0t4uTlcsJl4"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm sm:text-base hover:bg-white/10 transition-colors text-white"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Ver tráiler
              </a>
            </div>
          </div>
        </div>

        {/* Flecha animada */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-70">
          <ChevronRight className="w-6 h-6 text-white rotate-90 animate-bounce" />
        </div>
      </section>

      {/* CONTENIDO */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        {/* DESTACADAS */}
        <section className="pt-12 border-t border-zinc-800">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-yellow-400" size={26} />
              <h2 className="text-2xl sm:text-3xl font-bold">Películas destacadas</h2>
            </div>
            <Link
              to={RoutesPaths.movies}
              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              Ver todas <ChevronRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {loading &&
              Array.from({ length: 12 }).map((_, i) => (
                <article key={`f-${i}`} className="group rounded-xl bg-white/5 p-2 ring-1 ring-white/10">
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
              featured.map((m) => (
                <Link
                  key={m.id}
                  to={RoutesPaths.movieDetail(m.id)}
                  className="group rounded-xl bg-white/5 p-2 ring-1 ring-white/10 hover:bg-white/10 transition-colors"
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

                    {typeof m.rating === "number" && (
                      <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-yellow-400 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                        <Star size={12} fill="currentColor" /> {m.rating.toFixed(1)}
                      </div>
                    )}
                  </div>

                  <div className="mt-2">
                    <h3 className="line-clamp-1 text-sm font-medium">{m.titulo}</h3>
                    <p className="text-xs text-white/60 flex items-center gap-1">
                      <Calendar size={12} />
                      {m.fecha_estreno ? new Date(m.fecha_estreno).getFullYear() : "—"}
                    </p>
                  </div>
                </Link>
              ))}

            {!loading && featured.length === 0 && (
              <div className="col-span-full text-sm text-white/60">
                No hay películas destacadas disponibles.
              </div>
            )}
          </div>
        </section>

        {/* ESTRENOS DE LA SEMANA */}
        <section className="pt-16 border-t border-zinc-800">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">Estrenos de la semana</h2>
              <p className="text-white/60 text-sm">Descubre las últimas películas añadidas</p>
            </div>

            <div className="relative">
              <div className="flex items-center gap-3 rounded-full bg-zinc-900 border border-zinc-700 px-5 py-3 focus-within:border-cyan-500 transition-all duration-300">
                <Search size={18} className="text-gray-400" />
                <input
                  value={homeQuery}
                  onChange={(e) => setHomeQuery(e.target.value)}
                  placeholder="Buscar en estrenos..."
                  className="w-64 bg-transparent text-sm placeholder-gray-500 focus:outline-none"
                />
                {homeQuery && (
                  <button
                    onClick={() => setHomeQuery("")}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Limpiar búsqueda"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {loading &&
              Array.from({ length: 12 }).map((_, i) => (
                <article key={`s-${i}`} className="group rounded-xl bg-white/5 p-2 ring-1 ring-white/10">
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
              newReleases.map((m) => (
                <Link
                  key={m.id}
                  to={RoutesPaths.movieDetail(m.id)}
                  className="group rounded-xl bg-white/5 p-2 ring-1 ring-white/10 hover:bg-white/10 transition-colors"
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

                    {typeof m.rating === "number" && (
                      <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-yellow-400 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                        <Star size={12} fill="currentColor" /> {m.rating.toFixed(1)}
                      </div>
                    )}
                  </div>

                  <div className="mt-2">
                    <h3 className="line-clamp-1 text-sm font-medium">{m.titulo}</h3>
                    <p className="text-xs text-white/60 flex items-center gap-1">
                      <Calendar size={12} />
                      {m.fecha_estreno ? new Date(m.fecha_estreno).getFullYear() : "—"}
                    </p>
                  </div>
                </Link>
              ))}

            {!loading && newReleases.length === 0 && (
              <div className="col-span-full text-sm text-white/60">
                Sin resultados para “{homeQuery}”.
              </div>
            )}
          </div>
        </section>

        {/* NOTICIAS (DINÁMICAS) */}
        <section className="pt-14 border-t border-zinc-800">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="text-xl font-semibold">Noticias</h2>
            <div className="h-px flex-1 bg-white/10" />
            <Link to={RoutesPaths.news} className="text-sm text-[#007AFF] hover:underline">
              Ver todas
            </Link>
          </div>

          <NoticiasHomeGrid />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

/* === Componente interno para cargar y mostrar las 4 últimas noticias === */
function NoticiasHomeGrid() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    let ignore = false;

    const loadNews = async () => {
      try {
        setLoadingNews(true);
        const res = await listNoticias({ limit: 4, sortBy: "created_at", order: "DESC" });
        const data = Array.isArray(res) ? res : res.data || [];
        if (!ignore) setNoticias(data.slice(0, 4));
      } catch (err) {
        console.error("Error al cargar noticias:", err);
        if (!ignore) setNoticias([]);
      } finally {
        if (!ignore) setLoadingNews(false);
      }
    };

    loadNews();
    return () => {
      ignore = true;
    };
  }, []);

  if (loadingNews) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <article key={`n-skel-${i}`} className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
            <div className="aspect-video rounded-lg bg-white/10">
              <ShimmerLoader />
            </div>
            <div className="mt-3 h-4 w-3/4 bg-white/10 rounded" />
            <div className="mt-2 h-3 w-1/2 bg-white/10 rounded" />
          </article>
        ))}
      </div>
    );
  }

  if (!noticias.length) {
    return <p className="text-white/60 text-sm">No hay noticias disponibles.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {noticias.map((n) => (
        <Link
          key={n.id}
          to={RoutesPaths.newsDetail(n.id)}
          className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10 hover:bg-white/10 transition-colors"
        >
          <div className="aspect-video rounded-lg overflow-hidden bg-white/10">
            {n.imagen_url ? (
              <img
                src={n.imagen_url}
                alt={n.titulo}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-white/40">
                Sin imagen
              </div>
            )}
          </div>

          <p className="mt-3 line-clamp-2 text-sm text-white/80">{n.titulo}</p>
          <div className="mt-2 text-[11px] text-white/60 flex items-center gap-1">
            <Calendar size={12} />
            {n.fecha ? new Date(n.fecha).toLocaleDateString() : "Sin fecha"}
          </div>
        </Link>
      ))}
    </div>
  );
}
