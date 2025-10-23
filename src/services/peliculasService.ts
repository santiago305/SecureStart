import axiosInstance from "@/common/utils/axios";
import { API_PELICULAS_GROUP } from "./APIs";

export type PeliculaFilters = {
  page?: number;
  limit?: number;
  titulo?: string;
  idioma?: string;
  ratingMin?: number;
  ratingMax?: number;
  fechaDesde?: string; // ISO
  fechaHasta?: string; // ISO
  sortBy?: 'createdAt' | 'fecha_estreno' | 'rating';
  order?: 'ASC' | 'DESC';
}

export const listPeliculas = async (params: PeliculaFilters = {}) => {
  const response = await axiosInstance.get(API_PELICULAS_GROUP.list, { params });
  return response.data;
}

export const getPelicula = async (id: string) => {
  const response = await axiosInstance.get(API_PELICULAS_GROUP.getById(id));
  return response.data;
}

export const createPelicula = async (payload: any) => {
  const response = await axiosInstance.post(API_PELICULAS_GROUP.create, payload);
  return response.data;
}

export const updatePelicula = async (id: string, payload: any) => {
  const response = await axiosInstance.patch(API_PELICULAS_GROUP.update(id), payload);
  return response.data;
}

export const removePelicula = async (id: string) => {
  const response = await axiosInstance.patch(API_PELICULAS_GROUP.remove(id));
  return response.data;
}

export const restorePelicula = async (id: string) => {
  const response = await axiosInstance.patch(API_PELICULAS_GROUP.restore(id));
  return response.data;
}
