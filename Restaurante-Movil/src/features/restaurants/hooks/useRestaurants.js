import { useCallback, useEffect, useState } from 'react';

import { apiClient, getApiError } from '../../../shared/api';

// Capa "ViewModel": desacopla la UI de la forma exacta de la entidad del backend.
export const mapRestaurantToViewModel = (raw) => ({
  raw,
  id: raw?._id || raw?.id,
  name: raw?.restaurantName || 'Restaurante',
  address: raw?.restaurantAddress || '',
  phone: raw?.restaurantPhone || '',
  email: raw?.restaurantEmail || '',
  image: raw?.restaurantPhoto || null,
  openingHours: raw?.openingHours || '',
  closingHours: raw?.closingHours || '',
  hoursLabel:
    raw?.openingHours && raw?.closingHours ? `${raw.openingHours} - ${raw.closingHours}` : 'Horario no disponible',
  isActive: raw?.restaurantActive !== false,
});

// Lista de restaurantes activos (endpoint público).
export function useRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.get('/restaurants', { params: { page: 1, limit: 50, restaurantActive: true } });
      const list = res.data?.data || res.data?.restaurants || res.data || [];
      setRestaurants(Array.isArray(list) ? list.map(mapRestaurantToViewModel) : []);
    } catch (err) {
      setError(getApiError(err, 'No fue posible cargar los restaurantes'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  return { restaurants, loading, error, refetch: fetchRestaurants };
}

// Detalle de un restaurante por id (endpoint público). Útil para refrescar datos.
export function useRestaurant(id, initial = null) {
  const [restaurant, setRestaurant] = useState(initial);
  const [loading, setLoading] = useState(!initial);
  const [error, setError] = useState('');

  const fetchRestaurant = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.get(`/restaurants/${id}`);
      const data = res.data?.data || res.data?.restaurant || res.data;
      setRestaurant(mapRestaurantToViewModel(data));
    } catch (err) {
      setError(getApiError(err, 'No fue posible cargar el restaurante'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!initial) fetchRestaurant();
  }, [fetchRestaurant, initial]);

  return { restaurant, loading, error, refetch: fetchRestaurant };
}
