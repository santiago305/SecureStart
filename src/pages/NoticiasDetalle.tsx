import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, ArrowLeft } from "lucide-react";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { RoutesPaths } from "@/Router/config/routesPaths";
import { getNoticia } from "@/services/noticiasService";

export default function NoticiasDetalle() {
  const { id } = useParams<{ id: string }>();
  const [noticia, setNoticia] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const loadNoticia = async () => {
      try {
        setLoading(true);
        const res = await getNoticia(id!);
        setNoticia(res);
      } catch (err) {
        console.error("Error al cargar noticia:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadNoticia();
  }, [id]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <SiteHeader />
      <div className="h-12" />

      <main className="flex-grow mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Botón Volver alineado a la derecha */}
        <div className="flex justify-end mb-4">
          <Link
            to={RoutesPaths.news}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-1.5 text-sm hover:bg-white/10 transition-colors"
          >
            Volver <ArrowLeft size={16} />
          </Link>
        </div>

        {loading && <p className="text-white/60">Cargando noticia...</p>}
        {error && (
          <p className="text-red-400 text-center mt-10">Error al cargar la noticia.</p>
        )}
        {!loading && !error && noticia && (
          <article className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Imagen */}
            {noticia.imagen_url ? (
              <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-white/10">
                <img
                  src={noticia.imagen_url}
                  alt={noticia.titulo}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-[4/3] w-full rounded-xl bg-white/5 flex items-center justify-center text-white/40 text-sm">
                Sin imagen disponible
              </div>
            )}

            {/* Info textual */}
            <div className="space-y-3 lg:space-y-4">
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
                {noticia.titulo}
              </h1>
              {noticia.subtitulo && (
                <p className="text-white/80 text-sm sm:text-base">{noticia.subtitulo}</p>
              )}
              <div className="flex items-center gap-2 text-xs text-white/60">
                <Calendar size={14} />{" "}
                {noticia.fecha
                  ? new Date(noticia.fecha).toLocaleDateString()
                  : "Sin fecha"}
              </div>
              <div className="mt-4 text-white/90 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {noticia.contenido || "Sin contenido disponible."}
              </div>
            </div>
          </article>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
