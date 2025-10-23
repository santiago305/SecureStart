import { lazy, Suspense, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { TrendingUp, Users, ShoppingCart, MousePointerClick } from "lucide-react"
import ShimmerLoader from "@/components/loadings.tsx/ShimmerLoader"
import { listPeliculas } from "@/services/peliculasService"

const ChartAreaInteractive = lazy(() => import("@/components/chart-area-interactive"))

export default function Dashboard() {
  const [movies, setMovies] = useState<Array<{ id: string; titulo: string; duracion_minutos: number; idioma: string | null }>>([])
  const [loadingCatalog, setLoadingCatalog] = useState(true)

  useEffect(() => {
    let ignore = false
    const load = async () => {
      try {
        setLoadingCatalog(true)
        const res = await listPeliculas({ limit: 8, order: 'DESC' })
        if (!ignore) setMovies(res.data || [])
      } catch {
        if (!ignore) setMovies([])
      } finally {
        if (!ignore) setLoadingCatalog(false)
      }
    }
    load()
    return () => { ignore = true }
  }, [])
  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-white">Dashboard</h1>
        <p className="text-white/70">Resumen general del sitio</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="bg-black/60 border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-sm text-white/70">Usuarios</CardTitle>
            <CardDescription className="text-2xl text-white font-semibold">12,345</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between text-white/80">
            <span className="text-green-400 flex items-center gap-1"><TrendingUp size={16}/> +3.2%</span>
            <Users size={24} className="text-white/60" />
          </CardContent>
        </Card>

        <Card className="bg-black/60 border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-sm text-white/70">Ventas</CardTitle>
            <CardDescription className="text-2xl text-white font-semibold">$8,920</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between text-white/80">
            <span className="text-green-400 flex items-center gap-1"><TrendingUp size={16}/> +1.8%</span>
            <ShoppingCart size={24} className="text-white/60" />
          </CardContent>
        </Card>

        <Card className="bg-black/60 border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-sm text-white/70">Sesiones</CardTitle>
            <CardDescription className="text-2xl text-white font-semibold">27,501</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between text-white/80">
            <span className="text-green-400 flex items-center gap-1"><TrendingUp size={16}/> +4.6%</span>
            <MousePointerClick size={24} className="text-white/60" />
          </CardContent>
        </Card>

        <Card className="bg-black/60 border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-sm text-white/70">Conversión</CardTitle>
            <CardDescription className="text-2xl text-white font-semibold">2.3%</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between text-white/80">
            <span className="text-green-400 flex items-center gap-1"><TrendingUp size={16}/> +0.4%</span>
            <TrendingUp size={24} className="text-white/60" />
          </CardContent>
        </Card>
      </div>

      <Separator className="bg-white/10"/>

      <Suspense fallback={<div className="w-full h-64 grid place-content-center text-white/70"><ShimmerLoader/></div>}>
        <Card className="bg-black/60 border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-xl">Tendencia de visitas</CardTitle>
            <CardDescription className="text-white/70">Últimos 3 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartAreaInteractive />
          </CardContent>
        </Card>
      </Suspense>

      <Separator className="bg-white/10"/>

      <Card className="bg-black/60 border-white/10 text-white">
        <CardHeader>
          <CardTitle className="text-xl">Catálogo de películas</CardTitle>
          <CardDescription className="text-white/70">Últimas agregadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {loadingCatalog && Array.from({ length: 8 }).map((_, i) => (
              <div key={`s-${i}`} className="rounded-xl bg-white/5 p-2 ring-1 ring-white/10">
                <div className="aspect-2/3 w-full overflow-hidden rounded-lg bg-white/10"><ShimmerLoader/></div>
                <div className="mt-2">
                  <div className="h-4 w-3/4 bg-white/10 rounded" />
                  <div className="mt-1 h-3 w-1/2 bg-white/10 rounded" />
                </div>
              </div>
            ))}
            {!loadingCatalog && movies.map((m) => (
              <div key={m.id} className="rounded-xl bg-white/5 p-2 ring-1 ring-white/10">
                <div className="aspect-2/3 w-full overflow-hidden rounded-lg bg-white/10"><ShimmerLoader/></div>
                <div className="mt-2">
                  <h3 className="line-clamp-1 text-sm font-medium">{m.titulo}</h3>
                  <p className="text-xs text-white/60">{m.duracion_minutos} min {m.idioma ? `· ${m.idioma.toUpperCase()}` : ''}</p>
                </div>
              </div>
            ))}
            {!loadingCatalog && movies.length === 0 && (
              <div className="col-span-full text-sm text-white/60">No hay películas disponibles.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
