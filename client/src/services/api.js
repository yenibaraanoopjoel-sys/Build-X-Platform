import axios from "axios";
import { auth } from "../firebase/config";

// Default API base URL: relative path /api works out of the box on Firebase Hosting rewrites
const API_BASE_URL = process.env.REACT_APP_API_URL || "/api";

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 35000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Firebase ID Token automatically to all requests
API.interceptors.request.use(
  async (config) => {
    try {
      if (auth.currentUser) {
        const idToken = await auth.currentUser.getIdToken();
        config.headers.Authorization = `Bearer ${idToken}`;
      } else {
        const cachedToken = localStorage.getItem("token");
        if (cachedToken) {
          config.headers.Authorization = `Bearer ${cachedToken}`;
        }
      }
    } catch (e) {
      console.warn("Could not retrieve fresh auth token for API request:", e);
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
