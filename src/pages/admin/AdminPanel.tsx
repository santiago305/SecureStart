import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import PeliculasAdmin from "./PeliculasAdmin";
import AdminNoticias from "./AdminNoticias";
import { LayoutDashboard, Film, Newspaper } from "lucide-react";

export default function AdminPanel() {
  const [tab, setTab] = useState<"panel" | "peliculas" | "noticias">("panel");

  return (
    <div className="px-4 py-6 space-y-6">
      <Card className="bg-[#5a5a5a]/80 border-white/10 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <LayoutDashboard size={22} />
            Panel de Control
          </CardTitle>
          <CardDescription className="text-white/70">
            Gestiona películas, noticias y más desde un solo lugar.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* ======= TABS ======= */}
          <div className="flex gap-3 mb-6 flex-wrap">
            <Button
              onClick={() => setTab("panel")}
              className={`flex items-center gap-2 ${
                tab === "panel"
                  ? "bg-[#1565C0] hover:bg-[#1E88E5]"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              <LayoutDashboard size={16} />
              Panel
            </Button>
            <Button
              onClick={() => setTab("peliculas")}
              className={`flex items-center gap-2 ${
                tab === "peliculas"
                  ? "bg-[#1565C0] hover:bg-[#1E88E5]"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              <Film size={16} />
              Películas
            </Button>
            <Button
              onClick={() => setTab("noticias")}
              className={`flex items-center gap-2 ${
                tab === "noticias"
                  ? "bg-[#1565C0] hover:bg-[#1E88E5]"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              <Newspaper size={16} />
              Noticias
            </Button>
          </div>

          {/* ======= CONTENIDO SEGÚN TAB ======= */}
          {tab === "panel" && (
            <div className="space-y-6">
              <p className="text-white/80 text-lg">Bienvenido al panel administrativo.</p>

              <div className="grid sm:grid-cols-2 gap-6 mt-4">
                <Button
                  className="flex flex-col items-center justify-center bg-[#1565C0] hover:bg-[#1E88E5] h-32 rounded-xl"
                  onClick={() => setTab("peliculas")}
                >
                  <Film size={32} />
                  <span className="text-lg font-semibold mt-2">Películas</span>
                </Button>

                <Button
                  className="flex flex-col items-center justify-center bg-[#1565C0] hover:bg-[#1E88E5] h-32 rounded-xl"
                  onClick={() => setTab("noticias")}
                >
                  <Newspaper size={32} />
                  <span className="text-lg font-semibold mt-2">Noticias</span>
                </Button>
              </div>
            </div>
          )}

          {tab === "peliculas" && <PeliculasAdmin />}
          {tab === "noticias" && <AdminNoticias />}
        </CardContent>
      </Card>
    </div>
  );
}
