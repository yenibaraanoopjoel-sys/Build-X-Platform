import axios from "axios";

// Render Backend URL with local development fallback
const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://buildx-backend.onrender.com/api");

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 35000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token automatically to all outgoing requests
API.interceptors.request.use(
  (config) => {
    const cachedToken = localStorage.getItem("token");
    if (cachedToken && !cachedToken.startsWith("demo-")) {
      config.headers.Authorization = `Bearer ${cachedToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized API request — clearing session");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export default API;
