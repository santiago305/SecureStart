export const RoutesPaths = {
  // Públicas
  home: "/",
  about: "/nosotros",
  contact: "/contacto",
  profile: "/perfil",

  // Cine
  movies: "/peliculas",
  movieDetail: (id: string | number = ":id") => `/peliculas/${id}`,
  categories: "/categorias",
  news: "/noticias",
  newsDetail: (id: string | number = ":id") => `/noticias/${id}`,

  // Auth
  login: "/login",
  register: "/register",
  clientsRegister: "/registro-clientes",

  // Dashboard
  dashboard: "/dashboard",
  dashboardAdmin: "/dashboard/admin",
  dashboardProducts: "/dashboard/productos",
  dashboardProductShow: (id: string) => `/dashboard/productos/${id}`,
  dashboardProfile: "/dashboard/perfil",
  dashboardSettings: "/dashboard/configuracion",
} as const;

export type RouteName = keyof typeof RoutesPaths;
