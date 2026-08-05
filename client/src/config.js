const fallbackApiUrl =
  process.env.REACT_APP_API_URL ||
  "https://build-x-platform.onrender.com/api";

const fallbackSocketUrl =
  process.env.REACT_APP_SOCKET_URL ||
  "https://build-x-platform.onrender.com";

export const API_BASE_URL = fallbackApiUrl;

export const SOCKET_BASE_URL = fallbackSocketUrl;
