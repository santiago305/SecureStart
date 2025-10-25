import axiosInstance from "@/common/utils/axios";
import { API_NOTICIAS_GROUP } from "./APIs";

export type NoticiaFilters = {
  page?: number;
  limit?: number;
  titulo?: string;
  estado?: boolean;
  sortBy?: "created_at" | "fecha" | "rating";
  order?: "ASC" | "DESC";
};

// === Listar todas las noticias ===
export const listNoticias = async (params: NoticiaFilters = {}) => {
  const response = await axiosInstance.get(API_NOTICIAS_GROUP.list, { params });
  return response.data;
};

// === Obtener una noticia específica ===
export const getNoticia = async (id: string) => {
  const response = await axiosInstance.get(API_NOTICIAS_GROUP.getById(id));
  return response.data;
};

// === Crear noticia ===
export const createNoticia = async (payload: any) => {
  const response = await axiosInstance.post(API_NOTICIAS_GROUP.create, payload);
  return response.data;
};

// === Actualizar noticia ===
export const updateNoticia = async (id: string, payload: any) => {
  const response = await axiosInstance.patch(API_NOTICIAS_GROUP.update(id), payload);
  return response.data;
};

// === Eliminar (definitivo) ===
export const removeNoticia = async (id: string) => {
  const response = await axiosInstance.delete(API_NOTICIAS_GROUP.remove(id));
  return response.data;
};
