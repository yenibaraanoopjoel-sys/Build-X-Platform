import axios from "axios";
import { API_BASE_URL } from "../config";

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

//
// Attach JWT Token
//
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

//
// Handle common API errors
//
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("Network Error:", error.message);
      return Promise.reject(error);
    }

    const { status } = error.response;

    switch (status) {
      case 401:
        console.warn("Unauthorized. Logging out.");

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        if (
          window.location.pathname !== "/login" &&
          window.location.pathname !== "/register"
        ) {
          window.location.href = "/login";
        }
        break;

      case 403:
        console.warn("Forbidden");
        break;

      case 404:
        console.warn("API Not Found");
        break;

      case 500:
        console.error("Internal Server Error");
        break;

      default:
        break;
    }

    return Promise.reject(error);
  }
);

export default API;