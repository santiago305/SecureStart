import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Search, Play, Calendar } from "lucide-react";
import braveHero from "@/assets/images/Brave2.jpg";
import { RoutesPaths } from "@/Router/config/routesPaths";
import ShimmerLoader from "@/components/loadings.tsx/ShimmerLoader";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { listPeliculas } from "@/services/peliculasService";

export default function Home() {
  // scroll al iniciar vista
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, []);

  const [homeQuery, setHomeQuery] = useState("");
  const [movies, setMovies] = useState<Array<{ id: string; titulo: string; duracion_minutos: number; idioma: string | null }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        setLoading(true);
        const res = await listPeliculas({ titulo: homeQuery.trim() || undefined, limit: 12, order: 'DESC' });
        if (!ignore) setMovies(res.data || []);
      } catch {
        if (!ignore) setMovies([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => { ignore = true };
  }, [homeQuery]);

  // Nota: filtramos desde el backend usando el parámetro 'titulo'

  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader />
      <div className="h-16" />

      {/* HERO */}
      <section
        className="relative min-h-[88vh] overflow-hidden"
        style={{
          backgroundImage: `url(${braveHero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />

        <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <p className="text-xs tracking-widest text-white/70">IMAX 3D</p>
            <h1 className="mt-2 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              Siente el <span className="text-[#007AFF]">cine</span> como nunca
            </h1>
            <p className="mt-4 text-white/80">
              Estrenos, clásicos y experiencias inmersivas. Compra tus entradas y mira tráilers.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <Link
                to="/watch"
                className="rounded-full bg-[#007AFF] px-6 py-2 text-sm font-semibold text-black hover:brightness-110"
              >
                Ver ahora
              </Link>
              <button className="flex items-center gap-2 rounded-full border border-white/20 px-5 py-2 text-sm hover:bg-white/10">
                <Play size={16} /> Ver tráiler
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENIDO */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        {/* Estrenos */}
        <section className="pt-10">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-xl font-semibold">Estrenos de la semana</h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/15 px-3 py-1 text-xs bg-white/10">
                Todas las películas
              </span>
              {/* Buscador (aquí, no en header) */}
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
                <Search size={16} className="opacity-80" />
                <input
                  value={homeQuery}
                  onChange={(e) => setHomeQuery(e.target.value)}
                  placeholder="Buscar en estrenos"
                  className="w-56 bg-transparent text-sm placeholder-white/60 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {loading && Array.from({ length: 12 }).map((_, i) => (
              <article key={`s-${i}`} className="group rounded-xl bg-white/5 p-2 ring-1 ring-white/10">
                <div className="aspect-2/3 w-full overflow-hidden rounded-lg bg-white/10">
                  <ShimmerLoader />
                </div>
                <div className="mt-2">
                  <div className="h-4 w-3/4 bg-white/10 rounded" />
                  <div className="mt-1 h-3 w-1/2 bg-white/10 rounded" />
                </div>
              </article>
            ))}
            {!loading && movies.map((m) => (
              <article
                key={m.id}
                className="group rounded-xl bg-white/5 p-2 ring-1 ring-white/10 hover:bg-white/10"
              >
                <div className="aspect-2/3 w-full overflow-hidden rounded-lg bg-white/10">
                  <ShimmerLoader />
                </div>
                <div className="mt-2">
                  <h3 className="line-clamp-1 text-sm font-medium">{m.titulo}</h3>
                  <p className="text-xs text-white/60">{m.duracion_minutos} min {m.idioma ? `· ${m.idioma.toUpperCase()}` : ''}</p>
                </div>
              </article>
            ))}
            {!loading && movies.length === 0 && (
              <div className="col-span-full text-sm text-white/60">
                Sin resultados para “{homeQuery}”.
              </div>
            )}
          </div>
        </section>

        {/* Noticias */}
        <section className="pt-14">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="text-xl font-semibold">Noticias</h2>
            <div className="h-px flex-1 bg-white/10" />
            <Link to={RoutesPaths.news} className="text-sm text-[#007AFF] hover:underline">Ver todas</Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Link
                to={`/news/${i + 1}`}
                key={i}
                className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10 hover:bg-white/10"
              >
                <div className="aspect-video rounded-lg bg-white/10" />
                <p className="mt-3 line-clamp-2 text-sm text-white/80">
                  [Noticia {i + 1}] Breve descripción de la noticia con un pequeño resumen.
                </p>
                <div className="mt-2 text-[11px] text-white/60 flex items-center gap-1">
                  <Calendar size={12} /> 2025-05-{10 + i}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
