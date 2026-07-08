import axios from 'axios';

import { ENDPOINTS } from '../constants/endpoints';
import { useAuthStore } from '../store/authStore';

// Cliente del Gestor de Restaurantes (:3006/gestorRestaurantes/api/v1):
// restaurantes, menús, mesas, reservas, pedidos, promociones, reseñas.
const apiClient = axios.create({
  baseURL: ENDPOINTS.API,
  timeout: 20000,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers['x-token'] = token;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
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

export default apiClient;
