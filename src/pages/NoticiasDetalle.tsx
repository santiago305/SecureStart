import { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, ArrowLeft } from "lucide-react";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { RoutesPaths } from "@/router/config/routesPaths";

export default function NoticiasDetalle() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const { id } = useParams<{ id: string }>();

  // 🔹 Simulación de datos (puedes reemplazar con fetch a tu API)
  const data = useMemo(() => {
    const nid = Number(id || 1);
    return {
      id: nid,
      title: `Título de noticia ${nid}`,
      subtitle: `Subtítulo o bajada de la noticia ${nid}.`,
      date: `2025-06-${(10 + ((nid - 1) % 20)).toString().padStart(2, "0")}`,
      cover: "", // 🔸 Aquí irá la URL real de tu base de datos
      content:
        "Contenido completo de la noticia. Aquí puedes colocar texto largo, imágenes adicionales o videos embebidos. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    };
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

        {/* Layout principal */}
        <article className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Imagen solo si existe */}
          {data.cover ? (
            <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-white/10">
              <img
                src={data.cover}
                alt={data.title}
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
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight">{data.title}</h1>
            <p className="text-white/80 text-sm sm:text-base">{data.subtitle}</p>
            <div className="flex items-center gap-2 text-xs text-white/60">
              <Calendar size={14} /> {data.date}
            </div>
            <div className="mt-4 text-white/90 leading-relaxed text-sm sm:text-base">
              {data.content}
            </div>
          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
