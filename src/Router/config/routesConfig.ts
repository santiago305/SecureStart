
import { RouteMetadata } from "../types/RouterTypes";
import { RoutesPaths } from "./routesPaths";

// Carga dinámica de componentes

export const routesConfig: RouteMetadata[] = [

  // 📄 Rutas públicas
  { path: RoutesPaths.home, name: "Home", isPublic: true },
  { path: RoutesPaths.about, name: "About", isPublic: true },
  { path: RoutesPaths.contact, name: "Contact", isPublic: true },
  { path: "/products", name: "Products", isPublic: true },
  { path: "/products/:product", name: "Product.Show", isPublic: true },
  { path: RoutesPaths.movies, name: "Movies", isPublic: true },
  { path: RoutesPaths.movieDetail(), name: "Movie.Detail", isPublic: true },


  // 🔐 Rutas de autenticación
  { path: "/login", name: "Login", isAuthRoute: true },
  { path: "/register", name: "Register", isAuthRoute: true },

  // 👤 Registro de cliente (protegido)
  { path: "/clientsregister", name: "ClientsRegister", requiresClientRegister: true },

  // 📊 Dashboard y rutas anidadas bajo DashboardLayout
  { path: "/dashboard", name: "Dashboard", isProtected: true },
  { path: "/dashboard/products", name: "Dashboard.Products", isProtected: true },
  { path: "/dashboard/products/:id", name: "Dashboard.Product.Show", isProtected: true },
  { path: "/dashboard/profile", name: "Dashboard.Profile", isProtected: true },
  { path: "/dashboard/settings", name: "Dashboard.Settings", isProtected: true },
  
   // 🌐 Ruta de error 404
  { path: "*", name: "Error404", isPublic: true }
];
