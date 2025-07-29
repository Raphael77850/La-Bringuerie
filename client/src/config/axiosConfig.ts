import axios from "axios";

// Créez une instance d'axios avec une configuration de base
const api = axios.create({
  baseURL: "http://localhost:3310/api", // ou l'URL de votre serveur backend
});

// Ajoute automatiquement le token d'accès à chaque requête si présent
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_access_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Rafraîchit le token si la réponse est 401 (token expiré)
let isRefreshing = false;
interface FailedQueueItem {
  resolve: (token: string | null) => void;
  reject: (err: unknown) => void;
}
let failedQueue: FailedQueueItem[] = [];

function processQueue(error: unknown, token: string | null = null) {
  for (const prom of failedQueue) {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  }
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("admin_refresh_token")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (typeof token === "string") {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const refreshToken = localStorage.getItem("admin_refresh_token");
        const res = await api.post<{ accessToken?: string }>("/refresh-token", {
          refreshToken,
        });
        const newAccessToken = res.data.accessToken;
        localStorage.setItem("admin_access_token", newAccessToken || "");
        processQueue(null, newAccessToken || null);
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem("admin_access_token");
        localStorage.removeItem("admin_refresh_token");
        window.location.reload();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

export default api;
