import { lazy, Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { TrendingUp, Users, ShoppingCart, MousePointerClick } from "lucide-react"
import ShimmerLoader from "@/components/loadings.tsx/ShimmerLoader"

const ChartAreaInteractive = lazy(() => import("@/components/chart-area-interactive"))

export default function Dashboard() {
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
    </div>
  )
}
