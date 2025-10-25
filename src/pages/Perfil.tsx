import { useEffect, useState } from "react";
import { LogOut, Upload, KeyRound } from "lucide-react";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { findOwnUser, uploadUserAvatar } from "@/services/userService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type User = {
  id: string;
  name: string;
  email: string;
  deleted: boolean;
  createdAt: string;
  avatarUrl?: string;
  role?: { name?: string; description?: string };
};

export default function Perfil() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // para cambio de contraseña
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await findOwnUser();
        // si el backend devuelve data dentro de res.data
        setUser(res.data || res);
      } catch (err) {
        console.error("Error al obtener el usuario:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // 🔹 Subir avatar
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const formData = new FormData();
    formData.append("avatar", file);
    setUploading(true);
    try {
      const updated = await uploadUserAvatar(user.id, formData);
      setUser(updated.data || updated);
    } catch (err) {
      console.error("Error al subir avatar:", err);
      alert("Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  // 🔹 Cambiar contraseña
  const handlePasswordChange = async () => {
    if (!newPassword || !confirmPassword || !currentPassword) {
      alert("Por favor completa todos los campos.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Las contraseñas nuevas no coinciden.");
      return;
    }

    // Aquí llamarías a tu endpoint de cambio de contraseña con entropía
    console.log("Cambio de contraseña:", { currentPassword, newPassword });
    alert("Simulación de cambio de contraseña exitosa (falta endpoint).");
  };

  // 🔹 Estados de carga
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        Cargando perfil...
      </div>
    );

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        No se pudo cargar la información del usuario.
      </div>
    );

  // 🔹 Avatar y estilo
  const avatarSrc = user.avatarUrl
    ? import.meta.env.VITE_API_URL + user.avatarUrl
    : null;

  const roleName =
    user.role?.name?.toLowerCase() === "user" ||
    user.role?.description?.toLowerCase() === "user"
      ? "Member"
      : user.role?.name || user.role?.description || "Member";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col">
      <SiteHeader />

      {/* Header circular */}
      <div className="flex flex-col items-center mt-20 mb-14 relative">
        <div className="relative w-40 h-40 rounded-full flex items-center justify-center shadow-2xl border-4 border-purple-600 overflow-hidden">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-cyan-500 to-purple-600 text-6xl font-bold select-none">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Botón de subir foto (más grande) */}
          <label className="absolute bottom-0 right-0 bg-purple-600 p-3 rounded-full cursor-pointer hover:bg-purple-700 transition-all transform hover:scale-110">
            <Upload size={22} />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </label>
        </div>

        {uploading && (
          <p className="text-sm text-gray-400 mt-2">Subiendo imagen...</p>
        )}

        <h2 className="mt-6 text-2xl font-semibold">{user.name}</h2>
        <p className="text-gray-400">{user.email}</p>
        <p className="text-sm text-gray-500 mt-2">
          Miembro desde{" "}
          {new Date(user.createdAt).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Tarjeta de información */}
      <div className="flex justify-center mb-10 px-4">
        <div className="bg-gray-900/60 border border-gray-700 rounded-2xl p-6 w-full max-w-md text-left shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Información de la cuenta</h3>

          <div className="space-y-2">
            <p>
              <span className="text-gray-400">Nombre:</span> {user.name}
            </p>
            <p>
              <span className="text-gray-400">Correo:</span> {user.email}
            </p>
            <p>
              <span className="text-gray-400">Rol:</span> {roleName}
            </p>
            <p>
              <span className="text-gray-400">Estado:</span>{" "}
              {user.deleted ? "Inactivo" : "Activo"}
            </p>
          </div>

          {/* Cambio de contraseña */}
          <div className="mt-8 border-t border-gray-700 pt-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <KeyRound size={18} /> Cambiar contraseña
            </h3>

            <div className="space-y-3">
              <Input
                type="password"
                placeholder="Contraseña actual"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-gray-800 text-white border-gray-700 focus:ring-purple-600"
              />
              <Input
                type="password"
                placeholder="Nueva contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-gray-800 text-white border-gray-700 focus:ring-purple-600"
              />
              <Input
                type="password"
                placeholder="Confirmar nueva contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-gray-800 text-white border-gray-700 focus:ring-purple-600"
              />
              <Button
                onClick={handlePasswordChange}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold"
              >
                Guardar cambios
              </Button>
            </div>
          </div>

          {/* Cerrar sesión */}
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 py-2 rounded-lg font-semibold transition"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
