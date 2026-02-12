// src/api/client.ts
import axios from "axios";
import { getToken } from "../utils/token";

export const apiBaseUrl =
  import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export const api = axios.create({
  baseURL: apiBaseUrl,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    // ensure headers object exists before assignment
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
