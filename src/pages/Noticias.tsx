import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { RoutesPaths } from "@/Router/config/routesPaths";
import ShimmerLoader from "@/components/loadings.tsx/ShimmerLoader";
import { listNoticias } from "@/services/noticiasService";

type Noticia = {
  id: string;
  titulo: string;
  subtitulo?: string | null;
  imagen_url?: string | null;
  fecha?: string | null;
  contenido?: string | null;
  rating?: number | null;
  estado?: boolean;
};

export default function Noticias() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    let ignore = false;
    const load = async () => {
      try {
        setLoading(true);
        const res = await listNoticias({ sortBy: "created_at", order: "DESC", limit: 20 });
        const data = Array.isArray(res) ? res : res.data || [];
        if (!ignore) setNoticias(data);
      } catch (err) {
        console.error("Error al cargar noticias:", err);
        if (!ignore) setNoticias([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            <span className="text-[#007AFF]">AWS</span>CineBox · Noticias
          </h1>
          <Link to={RoutesPaths.home} className="text-sm text-[#007AFF] hover:underline">
            Ir al inicio
          </Link>
        </div>

        {/* Lista de noticias */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <article key={i} className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                <div className="aspect-video rounded-lg bg-white/10">
                  <ShimmerLoader />
                </div>
                <div className="mt-3 h-4 w-3/4 bg-white/10 rounded" />
                <div className="mt-2 h-3 w-1/2 bg-white/10 rounded" />
              </article>
            ))}
          </div>
        ) : noticias.length === 0 ? (
          <p className="text-white/60 text-sm">No hay noticias disponibles.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {noticias.map((n) => (
              <Link
                to={RoutesPaths.newsDetail(n.id)}
                key={n.id}
                className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10 hover:bg-white/10 transition-colors"
              >
                {/* Imagen */}
                {n.imagen_url ? (
                  <img
                    src={n.imagen_url}
                    alt={n.titulo}
                    className="aspect-video w-full object-cover rounded-lg"
                    loading="lazy"
                  />
                ) : (
                  <div className="aspect-video rounded-lg bg-white/10 flex items-center justify-center text-xs text-white/40">
                    Sin imagen
                  </div>
                )}

                {/* Texto */}
                <h3 className="mt-3 line-clamp-2 text-sm font-semibold">{n.titulo}</h3>
                {n.subtitulo && (
                  <p className="mt-1 line-clamp-2 text-xs text-white/70">{n.subtitulo}</p>
                )}
                <div className="mt-2 text-[11px] text-white/60 flex items-center gap-1">
                  <Calendar size={12} />
                  {n.fecha ? new Date(n.fecha).toLocaleDateString() : "Sin fecha"}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <SiteFooter />
    </div>
  );
}
