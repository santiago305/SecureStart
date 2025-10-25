import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Calendar, Clock, Star, Languages, Play, X } from "lucide-react";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import ShimmerLoader from "@/components/loadings.tsx/ShimmerLoader";
import { getPelicula } from "@/services/peliculasService";
import ReactPlayer from "react-player";


type Pelicula = {
  id: string;
  titulo: string;
  descripcion?: string | null;
  fecha_estreno?: string | null;
  duracion_minutos?: number | null;
  idioma?: string | null;
  rating?: number | null;
  generos?: string[] | null;
  poster_url?: string | null;
  trailer_url?: string | null;
  movie_url?: string | null;
};

function toYouTubeEmbed(url: string | null | undefined) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return `https://www.youtube.com/embed/${id}?rel=0`;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}?rel=0`;
    }
  } catch {}
  return null;
}

export default function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Pelicula | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const playerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        setLoading(true);
        const data = await getPelicula(String(id));
        if (!ignore) setMovie(data);
      } catch {
        if (!ignore) setMovie(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => { ignore = true; };
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const trailerUrl = movie?.trailer_url ? toYouTubeEmbed(movie.trailer_url) : null;
  const year = movie?.fecha_estreno ? new Date(movie.fecha_estreno).getFullYear() : undefined;

  const scrollToPlayer = () => {
    if (playerRef.current) {
        const offset = playerRef.current.getBoundingClientRect().top + window.scrollY - 100; 
        // 👆 ajusta -100 (px) según cuánto quieres subir o bajar el destino
        window.scrollTo({ top: offset, behavior: "smooth" });
    }
  };


  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader />
      <div className="h-16" />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ───── Información general ───── */}
        <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Imagen izquierda */}
          <div className="flex justify-center">
            {movie?.poster_url ? (
              <img
                src={movie.poster_url}
                alt={movie.titulo}
                className="rounded-2xl w-64 sm:w-72 object-cover shadow-lg shadow-blue-500/20"
              />
            ) : (
              <div className="rounded-xl bg-white/5 w-64 h-96 flex items-center justify-center text-sm text-white/50">
                Sin imagen
              </div>
            )}
          </div>

          {/* Texto derecha */}
          <div className="lg:col-span-2 flex flex-col justify-start space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
              {movie?.titulo || "Título no disponible"}
            </h1>

            <div className="flex flex-wrap gap-3 text-white/70 text-sm">
              {movie?.generos?.length ? (
                movie.generos.map((g, i) => (
                  <span
                    key={i}
                    className="inline-block bg-white/10 px-3 py-1 rounded-full border border-white/10"
                  >
                    {g}
                  </span>
                ))
              ) : (
                <span className="text-white/50 italic">Sin género</span>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-white/70 text-sm">
              {movie?.idioma && (
                <span className="inline-flex items-center gap-1">
                  <Languages size={14} /> {movie.idioma.toUpperCase()}
                </span>
              )}
              {movie?.duracion_minutos && (
                <span className="inline-flex items-center gap-1">
                  <Clock size={14} /> {movie.duracion_minutos} min
                </span>
              )}
              {typeof movie?.rating === "number" && (
                <span className="inline-flex items-center gap-1">
                  <Star size={14} className="text-yellow-400" /> {movie.rating.toFixed(1)}
                </span>
              )}
              {year && (
                <span className="inline-flex items-center gap-1">
                  <Calendar size={14} /> {year}
                </span>
              )}
            </div>

            <p className="text-white/80 leading-relaxed mt-2">
              {movie?.descripcion || "Explora una nueva historia cinematográfica."}
            </p>

            {/* Botones */}
            <div className="pt-5 flex flex-wrap gap-4">
              <button
                onClick={scrollToPlayer}
                className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 text-sm sm:text-base font-semibold text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-blue-500/30 flex items-center gap-2"
              >
                <Play size={18} fill="white" /> Ver ahora
              </button>

              <button
                onClick={() => setShowTrailer(true)}
                disabled={!trailerUrl}
                className="flex items-center gap-2 rounded-full border border-white/20 px-8 py-3 text-sm sm:text-base hover:bg-white/10 transition-colors text-white disabled:opacity-40"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Ver tráiler
              </button>
            </div>
          </div>
        </section>

        {/* ───── Reproductor (abajo) ───── */}
        <section ref={playerRef} className="mt-40">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            🎬 Reproductor
        </h2>

        <div className="rounded-2xl overflow-hidden ring-1 ring-white/10 bg-white/5">
            <div className="aspect-video w-full bg-black">
            {loading && <ShimmerLoader />}

            {!loading && movie?.movie_url && (
                <>
                {movie.movie_url.includes("youtube.com") || movie.movie_url.includes("youtu.be") ? (
                    // @ts-ignore
                    <ReactPlayer
                    url={movie.movie_url}
                    controls
                    width="100%"
                    height="100%"
                    style={{ borderRadius: "1rem" }}
                    />

                ) : (
                    <video
                    src={movie.movie_url}
                    controls
                    preload="metadata"
                    poster={movie.poster_url || undefined}
                    className="w-full h-full"
                    />
                )}
                </>
            )}

            {!loading && !movie?.movie_url && (
                <div className="flex items-center justify-center h-full text-white/60 text-sm">
                No hay fuente de video disponible.
                </div>
            )}
            </div>
        </div>
        </section>
      </main>

      <SiteFooter />

      {/* ───── Modal del tráiler ───── */}
      {showTrailer && trailerUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-[90%] max-w-4xl rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 rounded-full p-1.5 text-white"
            >
              <X size={20} />
            </button>

            <div className="aspect-video w-full">
              <iframe
                src={trailerUrl}
                title="Trailer"
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
