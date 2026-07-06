import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/**
 * Every backend endpoint wraps its payload in ApiResponseDto<T>:
 * { success, message, data, timestamp }. Service modules call this on the
 * axios response to get straight to `data` instead of repeating `.data.data`.
 */
export function unwrap(response) {
  return response.data.data;
}

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error;

    if (response?.status === 401 && !config._retry) {
      config._retry = true;
      const { refreshToken, setAccessToken, logout } = useAuthStore.getState();

      if (!refreshToken) {
        logout();
        return Promise.reject(error);
      }

      try {
        refreshPromise =
          refreshPromise ??
          axios.post(`${BASE_URL}/auth/refresh-token`, { refreshToken });
        const { data: envelope } = await refreshPromise;
        refreshPromise = null;

        const auth = envelope.data; // AuthResponse
        setAccessToken(auth.accessToken);
        config.headers.Authorization = `Bearer ${auth.accessToken}`;
        return api(config);
      } catch (refreshError) {
        refreshPromise = null;
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
