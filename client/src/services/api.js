import axios from "axios";

const API = axios.create({
  baseURL: "https://build-x-platform.onrender.com",
});

export default API;