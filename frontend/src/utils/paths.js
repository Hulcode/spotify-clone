export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
// utils/apiPaths.j
export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    REGISTER: "/api/auth/register",

    GET_USER: "/api/auth/get-user",
  },

  SONGS: {
    ALL_SONGS: "/api/song/list",
    GET_ALBUM_SONGS: "/api/song/album-songs",
  },
  ALBUMS: {
    ALL_ALBUMS: "/api/album/list",
    GET_ALBUM: "/api/album",
  },
};
