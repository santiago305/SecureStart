/**
 * Grupo de rutas para la autenticación.
 */
export const API_AUTH_GROUP = {
  authentication: '/auth/login',
  register: '/auth/register',
  logout: '/auth/logout',
  refreshToken: '/auth/refresh',
  validateToken: '/auth/validate-token'
};

/**
 * Grupo de rutas para la gestión de usuarios.
 */
export const API_USERS_GROUP = {
  base: "/users", 
  createUser: '/users/create',
  findAll: '/users/findAll',
  findActives: '/users/actives',
  findOwnUser: '/users/me',
  findById: (id: string) => `/users/search/${id}`,
  findByEmail: (email: string) => `/users/email/${email}`,
  updateUser: (id: string) => `/users/update/${id}`,
  deleteUser: (id: string) => `/users/delete/${id}`,
  restoreUser: (id: string) => `/users/restore/${id}`,
};

/**
 * Grupo de rutas para la gestión de clientes.
 */
export const API_CLIENTS_GROUP = {
  createClients: '/clients/create',
  findAll: '/clients/findAll',
  findActives: '/clients/actives',
  findOwnUser: '/clients/client-me',
  checkExistingClient: '/clients/check-existing-clients/me',
  findById: (id: string) => `/clients/search/${id}`,
  findByEmail: (email: string) => `/clients/email/${email}`,
  updateUser: (id: string) => `/clients/update/${id}`,
  deleteUser: (id: string) => `/clients/delete/${id}`,
};

/**
 * Grupo de rutas para la gestión de películas.
 */
export const API_PELICULAS_GROUP = {
  list: '/peliculas',
  getById: (id: string) => `/peliculas/${id}`,
  create: '/peliculas',
  update: (id: string) => `/peliculas/${id}`,
  remove: (id: string) => `/peliculas/remove/${id}`,
  restore: (id: string) => `/peliculas/restore/${id}`,
};

/**
 * Grupo de rutas para la gestión de noticias.
 */
export const API_NOTICIAS_GROUP = {
  list: "/noticias",
  getById: (id: string) => `/noticias/${id}`,
  create: "/noticias",
  update: (id: string) => `/noticias/${id}`,
  remove: (id: string) => `/noticias/${id}`,
  restore: (id: string) => `/noticias/restore/${id}`,
};

