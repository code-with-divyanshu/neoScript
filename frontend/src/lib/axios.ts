import axios from "axios";
import { useStore } from "./store";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
    withCredentials: true,
  },
});

api.interceptors.request.use((config) => {
  const token = useStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
