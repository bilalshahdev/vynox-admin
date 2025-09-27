// lib/axios.ts
import axios from "axios";
import { baseUrl } from "@/config/constants";

const isBrowser = typeof window !== "undefined";

export const api = axios.create({
  baseURL: `${baseUrl}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor → attach token
api.interceptors.request.use((config) => {
  if (isBrowser) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (typeof window !== "undefined") {
      const status = error?.response?.status;
      const url = error?.config?.url || "";

      // avoid redirect loop / reload during login request
      const isAuthLogin = url.includes("/auth/login");

      if (status === 401 && !isAuthLogin) {
        localStorage.removeItem("token");
        window.location.assign("/auth/login"); // or replace()
      }
    }
    return Promise.reject(error);
  }
);
