import axios from 'axios';

import { ENDPOINTS } from '../constants/endpoints';
import { useAuthStore } from '../store/authStore';

// Cliente del AuthService (:3005/api/v1): login, registro, verificación, perfil.
const authClient = axios.create({
  baseURL: ENDPOINTS.AUTH,
  timeout: 10000,
});

// Request: inyecta el token en los headers que acepta el backend (Authorization + x-token).
authClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers['x-token'] = token;
  }
  return config;
});

// Response: en 401 cerramos sesión (no hay refresh-token en móvil). Propaga mensaje legible.
authClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    // Un 401 en los endpoints de auth (login, etc.) es credencial inválida, no sesión expirada.
    const isAuthEndpoint = /\/auth\/(login|register|verify-email|resend-verification|forgot-password|reset-password)/.test(url);
    if (error.response?.status === 401 && !isAuthEndpoint) {
      useAuthStore.getState().logout();
    }
    error.readableMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Ocurrió un error de red';
    return Promise.reject(error);
  }
);

export default authClient;
