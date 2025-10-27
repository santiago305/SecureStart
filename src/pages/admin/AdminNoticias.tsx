import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  listNoticias,
  createNoticia,
  updateNoticia,
  removeNoticia,
} from "@/services/noticiasService";

interface Noticia {
  id: string;
  titulo: string;
  subtitulo?: string | null;
  imagen_url?: string | null;
  fecha?: string | null;
  contenido?: string | null;
  rating?: number | null;
  estado?: boolean;
}

const emptyForm: Partial<Noticia> = {
  titulo: "",
  subtitulo: "",
  imagen_url: "",
  fecha: "",
  contenido: "",
  rating: 0,
};

export default function AdminNoticias() {
  const [items, setItems] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Noticia>>(emptyForm);

  const load = async () => {
    setLoading(true);
    try {
      const res = await listNoticias({ titulo: query, limit: 20 });
      const data = Array.isArray(res) ? res : res.data || [];
      setItems(data);
      if (!data.length) toast.info("No se encontraron noticias con ese filtro");
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar noticias");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [query]);

  const handleChange = (k: keyof Noticia, v: any) =>
    setForm({ ...form, [k]: v });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titulo) return toast.error("El título es obligatorio");

    const payload = {
      titulo: form.titulo,
      subtitulo: form.subtitulo || null,
      imagen_url: form.imagen_url || null,
      fecha: form.fecha || null,
      contenido: form.contenido || null,
      rating: form.rating ?? 0,
      estado: true,
    };

    try {
      if (editingId) {
        await updateNoticia(editingId, payload);
        toast.success("Noticia actualizada");
      } else {
        await createNoticia(payload);
        toast.success("Noticia creada");
      }
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar noticia");
    }
  };

  const handleEdit = (n: Noticia) => {
    setEditingId(n.id);
    setForm({
      titulo: n.titulo,
      subtitulo: n.subtitulo || "",
      imagen_url: n.imagen_url || "",
      fecha: n.fecha || "",
      contenido: n.contenido || "",
      rating: n.rating || 0,
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await removeNoticia(id);
      toast.success("Noticia eliminada");
      await load();
    } catch (err) {
      console.error(err);
      toast.error("Error al eliminar noticia");
    }
  };

  return (
    <div className="px-4 py-6 space-y-6">
      <Card className="bg-[#5a5a5a]/80 border-white/10 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Administración de Noticias</CardTitle>
          <CardDescription className="text-white/70">
            Gestiona las noticias del portal: crear, editar o eliminar.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* BUSCADOR */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <Input
              placeholder="Buscar por título"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-black/40 border-white/10 text-white placeholder:text-white/40 max-w-xs"
            />
            <Button
              onClick={load}
              disabled={loading}
              className="bg-[#1565C0] hover:bg-[#1E88E5]"
            >
              Buscar
            </Button>
          </div>

          {/* FORMULARIO */}
          <form
            onSubmit={handleSubmit}
            className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/40 border border-white/10 p-4 rounded-md"
          >
            <div>
              <Label>Título</Label>
              <Input
                value={form.titulo || ""}
                onChange={(e) => handleChange("titulo", e.target.value)}
                className="bg-[#444]/60 border-white/10 text-white placeholder:text-white/70"
              />
            </div>

            <div>
              <Label>Subtítulo</Label>
              <Input
                value={form.subtitulo || ""}
                onChange={(e) => handleChange("subtitulo", e.target.value)}
                className="bg-[#444]/60 border-white/10 text-white placeholder:text-white/70"
              />
            </div>

            <div>
              <Label>Fecha</Label>
              <Input
                type="date"
                value={form.fecha || ""}
                onChange={(e) => handleChange("fecha", e.target.value)}
                className="bg-black/40 border-white/10 text-white"
              />
            </div>

            <div>
                <Label>Rating</Label>
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
              <Label>Imagen URL</Label>
              <Input
                value={form.imagen_url || ""}
                onChange={(e) => handleChange("imagen_url", e.target.value)}
                className="bg-black/40 border-white/10 text-white placeholder:text-white/40"
              />
            </div>

            <div className="md:col-span-2">
              <Label>Contenido</Label>
              <textarea
                value={form.contenido || ""}
                onChange={(e) => handleChange("contenido", e.target.value)}
                className="w-full h-24 resize-none bg-black/40 border-white/10 text-white placeholder:text-white/40 rounded-md p-2"
              />
            </div>

            <div className="md:col-span-2 flex gap-2">
              <Button type="submit" className="bg-[#1565C0] hover:bg-[#1E88E5]">
                {editingId ? "Guardar cambios" : "Crear"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>

          {/* TABLA */}
          <div className="mt-6 overflow-x-auto rounded-md border border-white/10">
            <table className="min-w-full text-sm">
              <thead className="text-left bg-black/40">
                <tr className="border-b border-white/10">
                  <th className="py-2 pr-4 font-semibold text-white/80">Título</th>
                  <th className="py-2 pr-4 font-semibold text-white/80">Subtítulo</th>
                  <th className="py-2 pr-4 font-semibold text-white/80">Fecha</th>
                  <th className="py-2 pr-4 font-semibold text-white/80">Rating</th>
                  <th className="py-2 pr-4 font-semibold text-white/80">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {items.map((n) => (
                  <tr key={n.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-2 pr-4 font-medium">{n.titulo}</td>
                    <td className="py-2 pr-4">{n.subtitulo || "-"}</td>
                    <td className="py-2 pr-4">
                      {n.fecha ? new Date(n.fecha).toLocaleDateString() : "-"}
                    </td>
                    <td className="py-2 pr-4">{n.rating ?? "-"}</td>
                    <td className="py-2 pr-4 flex gap-2">
                      <Button
                        size="sm"
                        className="bg-white/10 hover:bg-white/20"
                        onClick={() => handleEdit(n)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(n.id)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}

                {items.length === 0 && !loading && (
                  <tr>
                    <td className="py-4 text-white/70" colSpan={5}>
                      Sin resultados
                    </td>
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
