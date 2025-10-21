import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { RoutesPaths } from "@/Router/config/routesPaths";

type News = {
  id: number;
  title: string;
  subtitle: string;
  date: string;
  cover?: string;
};

export default function Noticias() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, []);

  const news: News[] = Array.from({ length: 12 }).map((_, i) => ({
    id: i + 1,
    title: `Título de noticia ${i + 1}`,
    subtitle: `Subtítulo o bajada descriptiva de la noticia ${i + 1}.`,
    date: `2025-06-${(10 + i).toString().padStart(2, "0")}`,
    cover: "",
  }));

  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            <span className="text-[#007AFF]">AWS</span>CineBox · Noticias
          </h1>
          <Link to={RoutesPaths.home} className="text-sm text-[#007AFF] hover:underline">
            Ir al inicio
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {news.map((n) => (
            <Link
              to={RoutesPaths.newsDetail(n.id)}
              key={n.id}
              className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10 hover:bg-white/10"
            >
              <div className="aspect-video rounded-lg bg-white/10" />
              <h3 className="mt-3 line-clamp-2 text-sm font-semibold">{n.title}</h3>
              <p className="mt-1 line-clamp-2 text-xs text-white/70">{n.subtitle}</p>
              <div className="mt-2 text-[11px] text-white/60 flex items-center gap-1">
                <Calendar size={12} /> {n.date}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
