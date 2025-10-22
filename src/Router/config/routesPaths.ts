export const RoutesPaths = {
  // Públicas
  home: "/",
  about: "/about",
  contact: "/contact",

  // Cine
  movies: "/movies",
  categories: "/categories",
  news: "/news",
  newsDetail: (id: string | number = ":id") => `/news/${id}`,

  // Auth
  login: "/login",
  register: "/register",
  clientsRegister: "/clients-register",

  // Dashboard
  dashboard: "/dashboard",
  dashboardAdmin: "/dashboard/admin",
  dashboardProducts: "/dashboard/products",
  dashboardProductShow: (id: string) => `/dashboard/products/${id}`,
  dashboardProfile: "/dashboard/profile",
  dashboardSettings: "/dashboard/settings",
} as const;

export type RouteName = keyof typeof RoutesPaths;
