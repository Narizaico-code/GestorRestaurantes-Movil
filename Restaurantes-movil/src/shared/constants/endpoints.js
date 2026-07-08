// URLs base leídas de variables EXPO_PUBLIC_* (.env) con fallback a localhost.
// En dispositivo físico SIEMPRE usar la IP LAN del backend (no localhost).

const resolveUrl = (preferred, legacy, fallback) => {
  const value = preferred || legacy || fallback;
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
};

export const ENDPOINTS = {
  // AuthService (:3005/api/v1): login, registro, verificación, perfil.
  AUTH: resolveUrl(process.env.EXPO_PUBLIC_AUTH_URL, process.env.EXPO_PUBLIC_AUTH_BASE_URL, 'http://localhost:3005/api/v1'),
  // Gestor de Restaurantes (:3006/gestorRestaurantes/api/v1): restaurantes, menús, reservas, pedidos...
  API: resolveUrl(process.env.EXPO_PUBLIC_API_URL, process.env.EXPO_PUBLIC_RESTAURANT_URL, 'http://localhost:3006/gestorRestaurantes/api/v1'),
  API_HEALTH: resolveUrl(process.env.EXPO_PUBLIC_API_HEALTH_URL, null, 'http://localhost:3006/health'),
};
