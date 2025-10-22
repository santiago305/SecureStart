import { useState } from "react";
import { Pencil, Trash2, Plus, Film, Clock, ListChecks, Eye, Upload, Settings, Activity } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Movie {
  id: number;
  title: string;
  duration: number;
  genre: string;
}

const genres = ["ACCIÓN", "DRAMA", "COMEDIA"];

export default function AdminPanel() {
  const [movies, setMovies] = useState<Movie[]>(
    Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      title: `Película ${i + 1}`,
      duration: 100 + (i % 30),
      genre: genres[i % 3],
    }))
  );

  const [search, setSearch] = useState("");
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filtered = movies.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setMovies((prev) => prev.filter((m) => m.id !== id));
    toast.success("Película eliminada");
  };

  const handleSave = (movie: Movie) => {
    if (editingMovie) {
      // Edit
      setMovies((prev) =>
        prev.map((m) => (m.id === movie.id ? movie : m))
      );
      toast.success("Película actualizada");
    } else {
      // Add
      setMovies((prev) => [
        ...prev,
        { ...movie, id: prev.length ? prev[prev.length - 1].id + 1 : 1 },
      ]);
      toast.success("Película creada");
    }
    setIsDialogOpen(false);
    setEditingMovie(null);
  };

  return (
    <div className="px-4 py-8 max-w-6xl mx-auto space-y-6">
      <Card className="bg-black/60 border-white/10 text-white">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold tracking-tight">Panel de Administración</CardTitle>
          <CardDescription className="text-white/70">
            Gestiona el catálogo de películas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <Card className="bg-black/40 border-white/10 text-white">
              <CardHeader>
                <CardTitle className="text-sm text-white/70">Películas</CardTitle>
                <CardDescription className="text-2xl text-white font-semibold">{movies.length}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between text-white/80">
                <span className="text-green-400 flex items-center gap-1"><Activity size={16}/> +2 hoy</span>
                <Film size={24} className="text-white/60" />
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-white/10 text-white">
              <CardHeader>
                <CardTitle className="text-sm text-white/70">Géneros</CardTitle>
                <CardDescription className="text-2xl text-white font-semibold">{new Set(movies.map(m=>m.genre)).size}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between text-white/80">
                <span className="text-green-400 flex items-center gap-1"><Activity size={16}/> activos</span>
                <ListChecks size={24} className="text-white/60" />
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-white/10 text-white">
              <CardHeader>
                <CardTitle className="text-sm text-white/70">Duración promedio</CardTitle>
                <CardDescription className="text-2xl text-white font-semibold">{Math.round(movies.reduce((a,m)=>a+m.duration,0)/movies.length)} min</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between text-white/80">
                <span className="text-white/70">Últimos 30 días</span>
                <Clock size={24} className="text-white/60" />
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-white/10 text-white">
              <CardHeader>
                <CardTitle className="text-sm text-white/70">Pendientes por revisar</CardTitle>
                <CardDescription className="text-2xl text-white font-semibold">3</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between text-white/80">
                <span className="text-yellow-400">Revisión requerida</span>
                <Eye size={24} className="text-white/60" />
              </CardContent>
            </Card>
          </div>

          {/* Acciones rápidas */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Button onClick={() => { setEditingMovie(null); setIsDialogOpen(true); }} className="bg-[#1565C0] hover:bg-[#1E88E5] text-white">
              <Plus size={16} className="mr-2" /> Agregar película
            </Button>
            <Button className="bg-white/10 text-white hover:bg-white/20 border-0">
              <Upload size={16} className="mr-2" /> Importar catálogo
            </Button>
            <Button className="bg-white/10 text-white hover:bg-white/20 border-0">
              <Settings size={16} className="mr-2" /> Configuración
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="w-full sm:w-72">
              <Input
                placeholder="Buscar por título..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-black/40 border-white/10 text-white placeholder:text-white/50"
              />
            </div>
            <Button
              onClick={() => {
                setEditingMovie(null);
                setIsDialogOpen(true);
              }}
              className="bg-[#1565C0] hover:bg-[#1E88E5] text-white"
            >
              <Plus size={16} className="mr-2" /> Nueva película
            </Button>
          </div>

          <div className="overflow-x-auto rounded-md border border-white/10">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-white/80">ID</TableHead>
                  <TableHead className="text-white/80">Título</TableHead>
                  <TableHead className="text-white/80">Duración</TableHead>
                  <TableHead className="text-white/80">Género</TableHead>
                  <TableHead className="text-right text-white/80">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((movie) => (
                  <TableRow key={movie.id} className="border-white/10">
                    <TableCell className="text-white/90">{movie.id}</TableCell>
                    <TableCell className="text-white">{movie.title}</TableCell>
                    <TableCell className="text-white/90">{movie.duration} min</TableCell>
                    <TableCell className="text-white/90">{movie.genre}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          className="text-blue-400 hover:text-blue-300 hover:bg-white/10"
                          onClick={() => {
                            setEditingMovie(movie);
                            setIsDialogOpen(true);
                          }}
                          size="icon"
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          className="text-red-400 hover:text-red-300 hover:bg-white/10"
                          onClick={() => handleDelete(movie.id)}
                          size="icon"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-white/60">
                      No se encontraron películas.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableCaption className="text-white/60">Listado de películas</TableCaption>
            </Table>
          </div>

          <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/50" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Content className="w-full max-w-md rounded-lg bg-black/80 text-white p-6 shadow-xl ring-1 ring-white/10">
                  <Dialog.Title className="text-lg font-bold mb-4">
                    {editingMovie ? "Editar Película" : "Nueva Película"}
                  </Dialog.Title>

                  <MovieForm
                    movie={editingMovie}
                    onSave={handleSave}
                    onCancel={() => {
                      setIsDialogOpen(false);
                      setEditingMovie(null);
                    }}
                  />
                </Dialog.Content>
              </div>
            </Dialog.Portal>
          </Dialog.Root>
        </CardContent>
      </Card>

      
    </div>
  );
}

function MovieForm({
  movie,
  onSave,
  onCancel,
}: {
  movie: Movie | null;
  onSave: (movie: Movie) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(movie?.title || "");
  const [duration, setDuration] = useState(movie?.duration || 90);
  const [genre, setGenre] = useState(movie?.genre || "ACCIÓN");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      id: movie?.id || 0,
      title,
      duration,
      genre,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label>Título</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-black/40 border-white/10 text-white placeholder:text-white/40"
          placeholder="Nombre de la película"
          required
        />
      </div>
      <div className="space-y-1">
        <Label>Duración (min)</Label>
        <Input
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          min={1}
          className="bg-black/40 border-white/10 text-white placeholder:text-white/40"
          required
        />
      </div>
      <div className="space-y-1">
        <Label>Género</Label>
        <Select value={genre} onValueChange={setGenre}>
          <SelectTrigger className="bg-black/40 border-white/10 text-white">
            <SelectValue placeholder="Selecciona un género" />
          </SelectTrigger>
          <SelectContent className="bg-black/90 text-white border-white/10">
            {genres.map((g) => (
              <SelectItem key={g} value={g} className="text-white">
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="border-white/10 text-white hover:bg-white/10">
          Cancelar
        </Button>
        <Button type="submit" className="bg-[#1565C0] hover:bg-[#1E88E5] text-white">
          Guardar
        </Button>
      </div>
    </form>
  );
}
    