import axios from "axios";
import { refreshAccessToken, storeTokens, clearTokens, getStoredAccessToken, getStoredRefreshToken, isTokenExpired } from "@/services/authService";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

function processQueue(error: any, token: string | null) {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token!);
  });
  failedQueue = [];
}

api.interceptors.request.use(
  async (config) => {
    let token = getStoredAccessToken();

    if (token && isTokenExpired(token)) {
      const refreshToken = getStoredRefreshToken();
      if (refreshToken) {
        try {
          const tokens = await refreshAccessToken(refreshToken);
          storeTokens(tokens);
          token = tokens.access_token;
        } catch {
          clearTokens();
          window.location.href = "/login";
          return Promise.reject(new Error("Session expired"));
        }
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;
      const refreshToken = getStoredRefreshToken();

      if (!refreshToken) {
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const tokens = await refreshAccessToken(refreshToken);
        storeTokens(tokens);
        processQueue(null, tokens.access_token);
        originalRequest.headers.Authorization = `Bearer ${tokens.access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
