import axios from "axios";
import { auth } from "../firebase/config";

// Render Backend URL with local development fallback
const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://build-x-platform.onrender.com/api");

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 35000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token automatically to all outgoing requests
API.interceptors.request.use(
  async (config) => {
    try {
      const cachedToken = localStorage.getItem("token");
      if (cachedToken) {
        config.headers.Authorization = `Bearer ${cachedToken}`;
      } else if (auth?.currentUser) {
        const idToken = await auth.currentUser.getIdToken();
        config.headers.Authorization = `Bearer ${idToken}`;
      }
    } catch (e) {
      console.warn("Could not retrieve auth token for API request:", e);
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
      console.warn("Unauthorized API request");
    }
    return Promise.reject(error);
  }
);

export default API;
