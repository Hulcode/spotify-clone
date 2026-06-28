import axios from "axios";
import { BASE_URL } from "./paths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.status === 403) {
      window.location.href = "/register";
    }
    return response;
  },
  (error) => {
    // Handle common errors globally
    if (error.response) {
      if (error.response.status === 401) {
        // Redirect to login page
        window.location.href = "/login";
      } else if (error.response.status === 500) {
        console.error("Server error. Please try again later.");
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout. Please try again.");
    } else if (!error.response) {
      console.error("Network error. Please check your connection.");
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
