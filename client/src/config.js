const isLocal =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

const fallbackApiUrl = isLocal
  ? "http://localhost:5000/api"
  : "https://build-x-platform.onrender.com/api";

const fallbackSocketUrl = isLocal
  ? "http://localhost:5000"
  : "https://build-x-platform.onrender.com";

export const API_BASE_URL =
  process.env.REACT_APP_API_URL || fallbackApiUrl;

export const SOCKET_BASE_URL =
  process.env.REACT_APP_SOCKET_URL || fallbackSocketUrl;
