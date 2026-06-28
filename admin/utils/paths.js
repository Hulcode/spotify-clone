export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
// utils/apiPaths.j
export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
  },

  SONGS: {
    ADD: "/api/song/add",
    ALL_SONGS: "/api/song/list",

    DELETE: (id) => `/api/song/remove/${id}`,
  },
  ALBUMS: {
    ADD: "/api/album/add",
    ALL_ALBUMS: "/api/album/list",

    DELETE: (id) => `/api/album/remove/${id}`,
  },
};
