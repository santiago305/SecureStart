import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { listPeliculas, createPelicula, updatePelicula, removePelicula, restorePelicula } from "@/services/peliculasService";
import { toast } from "sonner";

interface Pelicula {
  id: string;
  titulo: string;
  descripcion: string | null;
  fecha_estreno: string | null;
  duracion_minutos: number;
  rating: number;
  idioma: string | null;
  poster_url: string | null;
  trailer_url: string | null;
  generos?: string[];
  deleted: boolean;
}

const emptyForm: Partial<Pelicula> = {
  titulo: "",
  descripcion: "",
  fecha_estreno: "",
  duracion_minutos: 0,
  rating: 0,
  idioma: "",
  poster_url: "",
  trailer_url: "",
  generos: [],
};


export default function PeliculasAdmin() {
  const [items, setItems] = useState<Pelicula[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Pelicula>>(emptyForm);

  const load = async () => {
    setLoading(true);
    try {
      const res = await listPeliculas({ titulo: query, limit: 20 });
      setItems(res.data || []);
      if (!res.data?.length) toast.info("No se encontraron películas con ese filtro");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [query]);

  const handleChange = (k: keyof Pelicula, v: any) => setForm({ ...form, [k]: v });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titulo) return;
    const payload: any = {
      ...form,
      fecha_estreno: form.fecha_estreno || null,
      descripcion: form.descripcion ?? null,
      idioma: form.idioma || null,
      poster_url: form.poster_url || null,
      trailer_url: form.trailer_url || null,
    };
    if (editingId) {
      await updatePelicula(editingId, payload);
      toast.success("Película actualizada");
    } else {
      await createPelicula(payload);
      toast.success("Película creada");
    }
    setForm(emptyForm);
    setEditingId(null);
    await load();
  };

  const handleEdit = (p: Pelicula) => {
    setEditingId(p.id);
    setForm({
      titulo: p.titulo,
      descripcion: p.descripcion || "",
      fecha_estreno: p.fecha_estreno ? String(p.fecha_estreno).slice(0, 10) : "",
      duracion_minutos: p.duracion_minutos,
      rating: Number(p.rating),
      idioma: p.idioma || "",
      poster_url: p.poster_url || "",
      trailer_url: p.trailer_url || "",
      generos: p.generos || [], 
    });
  };


  return (
    <div className="px-4 py-6 space-y-6">
      <Card className="bg-[#5a5a5a]/80 border-white/10 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Administración de Películas</CardTitle>
          <CardDescription className="text-white/70">Gestiona el catálogo: crear, editar, eliminar o restaurar.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <Input
              placeholder="Buscar por título"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-black/40 border-white/10 text-white placeholder:text-white/40 max-w-xs"
            />
            <Button onClick={load} disabled={loading} className="bg-[#1565C0] hover:bg-[#1E88E5]">Buscar</Button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-black/40 border border-white/10 p-4 rounded-md">
            <div>
              <Label>Título</Label>
              <Input value={form.titulo || ""} onChange={(e) => handleChange("titulo", e.target.value)} className="bg-[#444]/60 border-white/10 text-white placeholder:text-white/70"/>
            </div>
            <div>
              <Label>Idioma</Label>
              <Input value={form.idioma || ""} onChange={(e) => handleChange("idioma", e.target.value)} className="bg-[#444]/60 border-white/10 text-white placeholder:text-white/70"/>
            </div>
            <div>
              <Label>Fecha estreno</Label>
              <Input type="date" value={form.fecha_estreno || ""} onChange={(e) => handleChange("fecha_estreno", e.target.value)} className="bg-[#444]/60 border-white/10 text-white placeholder:text-white/70" />
            </div>
            <div>
              <Label>Duración (min)</Label>
              <Input type="number" value={form.duracion_minutos ?? 0} onChange={(e) => handleChange("duracion_minutos", Number(e.target.value))} className="bg-black/40 border-white/10 text-white placeholder:text-white/40" />
            </div>
            <div>
              <Label>Rating (0 - 10)</Label>
              <Input
                type="number"
                min={0}
                max={10}
                step={0.1}
                value={form.rating ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  const num = parseFloat(val);

                  // Permitir vacío temporal mientras se escribe
                  if (val === "") {
                    handleChange("rating", undefined);
                    return;
                  }

                  // Validaciones
                  if (num > 10) {
                    toast.warning("El rating debe ser menor o igual a 10");
                    handleChange("rating", 10);
                  } else if (num < 0) {
                    toast.warning("El rating debe ser mayor o igual a 0");
                    handleChange("rating", 0);
                  } else {
                    handleChange("rating", num);
                  }
                }}
                className="bg-black/40 border-white/10 text-white placeholder:text-white/40"
              />
            </div>
            <div>
              <Label>Géneros (separados por coma)</Label>
              <input
                type="text"
                inputMode="text"
                placeholder="Ej: Acción, Drama, Ciencia ficción"
                value={form.generos?.join(", ") || ""}
                onChange={(e) =>
                  handleChange(
                    "generos",
                    e.target.value
                      .split(",")
                      .map((g) => g.trim())
                      .filter((g) => g.length > 0)
                  )
                }
                className="bg-black/40 border-white/10 text-white placeholder:text-white/40 w-full p-2 rounded-md outline-none"
              />
            </div>


            <div className="md:col-span-3">
              <Label>Descripción</Label>
              <Input value={form.descripcion || ""} onChange={(e) => handleChange("descripcion", e.target.value)} className="bg-black/40 border-white/10 text-white placeholder:text-white/40" />
            </div>
            <div>
              <Label>Poster URL</Label>
              <Input value={form.poster_url || ""} onChange={(e) => handleChange("poster_url", e.target.value)} className="bg-black/40 border-white/10 text-white placeholder:text-white/40" />
            </div>
            <div>
              <Label>Trailer URL</Label>
              <Input value={form.trailer_url || ""} onChange={(e) => handleChange("trailer_url", e.target.value)} className="bg-black/40 border-white/10 text-white placeholder:text-white/40" />
            </div>
            <div className="md:col-span-3 flex gap-2">
              <Button type="submit" className="bg-[#1565C0] hover:bg-[#1E88E5]">{editingId ? "Guardar cambios" : "Crear"}</Button>
              {editingId && (
                <Button type="button" variant="secondary" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancelar</Button>
              )}
            </div>
          </form>

          <div className="mt-6 overflow-x-auto rounded-md border border-white/10">
            <table className="min-w-full text-sm">
              <thead className="text-left bg-black/40">
                <tr className="border-b border-white/10">
                  <th className="py-2 pr-4 font-semibold text-white/80">Título</th>
                  <th className="py-2 pr-4 font-semibold text-white/80">Descripción</th>
                  <th className="py-2 pr-4 font-semibold text-white/80">Idioma</th>
                  <th className="py-2 pr-4 font-semibold text-white/80">Duración</th>
                  <th className="py-2 pr-4 font-semibold text-white/80">Géneros</th>
                  <th className="py-2 pr-4 font-semibold text-white/80">Rating</th>
                  <th className="py-2 pr-4 font-semibold text-white/80">Estado</th>
                  <th className="py-2 pr-4 font-semibold text-white/80">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-2 pr-4 font-medium">{p.titulo}</td>
                    <td className="py-2 pr-4">{p.descripcion || "-"}</td>
                    <td className="py-2 pr-4">{p.idioma || "-"}</td>
                    <td className="py-2 pr-4">{p.duracion_minutos} min</td>
                    <td className="py-2 pr-4">
                      {p.generos?.length ? p.generos.join(", ") : "-"}
                    </td>
                    <td className="py-2 pr-4">{p.rating}</td>
                    <td className="py-2 pr-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] ${p.deleted ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                        {p.deleted ? 'Eliminada' : 'Activa'}
                      </span>
                    </td>
                    <td className="py-2 pr-4 flex gap-2">
                      <Button size="sm" className="bg-white/10 hover:bg-white/20" onClick={() => handleEdit(p)}>Editar</Button>
                      {!p.deleted ? (
                        <Button size="sm" variant="destructive" onClick={async () => { await removePelicula(p.id); toast.success('Película eliminada'); await load(); }}>Eliminar</Button>
                      ) : (
                        <Button size="sm" variant="secondary" onClick={async () => { await restorePelicula(p.id); toast.success('Película restaurada'); await load(); }}>Restaurar</Button>
                      )}
                    </td>
                  </tr>
                ))}
                {items.length === 0 && !loading && (
                  <tr>
                    <td className="py-4 text-white/70" colSpan={8}>Sin resultados</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
