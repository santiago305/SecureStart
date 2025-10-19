import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import ShimmerLoader from "@/components/loadings.tsx/ShimmerLoader";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

type Movie = {
  id: number;
  title: string;
  duration: number;
  genre: string;
};

const GENRES = ["ACCIÓN", "DRAMA", "COMEDIA", "FANTASÍA", "TERROR", "CIENCIA FICCIÓN"];

export default function Categorias() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, []);

  const movies: Movie[] = useMemo(
    () =>
      Array.from({ length: 60 }).map((_, i) => ({
        id: i + 1,
        title: `Película ${i + 1}`,
        duration: 90 + (i % 40),
        genre: GENRES[i % GENRES.length],
      })),
    []
  );

  const [query, setQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState<string | null>(null);

  const filtered = movies
    .filter((m) => (activeGenre ? m.genre === activeGenre : true))
    .filter((m) => m.title.toLowerCase().includes(query.toLowerCase()));

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

        {/* Panel fijo arriba */}
        <div className="sticky top-16 z-10 mb-6 rounded-xl bg-white/5 p-3 ring-1 ring-white/10 backdrop-blur supports-[backdrop-filter]:bg-black/30">
          <h3 className="mb-3 text-sm font-semibold text-white/80">Buscar y filtrar por género</h3>

          {/* Buscador */}
          <div className="mb-3 flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
            <Search size={16} className="opacity-80" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por título"
              className="w-full bg-transparent text-sm placeholder-white/60 focus:outline-none"
            />
          </div>

          {/* Chips de géneros */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveGenre(null)}
              className={`rounded-full border border-white/15 px-3 py-1 text-xs hover:bg-white/10 ${
                activeGenre === null ? "bg-white/10" : ""
              }`}
            >
              Todos
            </button>
            {GENRES.map((g) => (
              <button
                key={g}
                onClick={() => setActiveGenre(g)}
                className={`rounded-full border border-white/15 px-3 py-1 text-xs hover:bg-white/10 ${
                  activeGenre === g ? "bg-white/10" : ""
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Lista */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {filtered.map((m) => (
            <article
              key={m.id}
              className="rounded-xl bg-white/5 p-2 ring-1 ring-white/10 hover:bg-white/10"
            >
              <div className="aspect-[2/3] w-full overflow-hidden rounded-lg bg-white/10">
                <ShimmerLoader />
              </div>
              <div className="mt-2">
                <h3 className="line-clamp-1 text-sm font-medium">{m.title}</h3>
                <p className="text-xs text-white/60">
                  {m.duration} min · {m.genre}
                </p>
              </div>
            </article>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-sm text-white/60">
              {activeGenre ? (
                <>No hay resultados en “{activeGenre}” para “{query}”.</>
              ) : (
                <>Sin resultados para “{query}”.</>
              )}
            </div>
          )}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
