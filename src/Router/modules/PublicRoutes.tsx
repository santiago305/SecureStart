/**
 * Definición de rutas públicas de la aplicación.
 * 
 * Estas rutas no requieren autenticación y están disponibles para todos los usuarios.
 * Cada ruta maneja su propio componente de error a través de `errorElement`.
 * 
 * @module PublicRoutes
 */

import { RoutesPaths } from "../config/routesPaths";
import { RouteObject } from "react-router-dom";
import { lazy } from "react";

const Home = lazy(() => import("@/pages/Home"));
const Peliculas = lazy(() => import("@/pages/Peliculas"));
const MovieDetail = lazy(() => import("@/pages/MovieDetail"));
const Categorias = lazy(() => import("@/pages/Categorias"));
const Noticias = lazy(() => import("@/pages/Noticias"));
const NoticiasDetalle = lazy(() => import("@/pages/NoticiasDetalle"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const ErrorPage = lazy(() => import("@/pages/Error404"));

export const publicRoutes: RouteObject[] = [
  { path: RoutesPaths.home, element: <Home />, errorElement: <ErrorPage /> },
  { path: RoutesPaths.movies, element: <Peliculas />, errorElement: <ErrorPage /> },
  { path: RoutesPaths.movieDetail(), element: <MovieDetail />, errorElement: <ErrorPage /> },
  { path: RoutesPaths.categories, element: <Categorias />, errorElement: <ErrorPage /> },
  { path: RoutesPaths.news, element: <Noticias />, errorElement: <ErrorPage /> },
  { path: RoutesPaths.newsDetail(), element: <NoticiasDetalle />, errorElement: <ErrorPage /> },
  { path: RoutesPaths.about, element: <About />, errorElement: <ErrorPage /> },
  { path: RoutesPaths.contact, element: <Contact />, errorElement: <ErrorPage /> },
];
