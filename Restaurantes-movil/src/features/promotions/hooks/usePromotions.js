import { useCallback, useEffect, useState } from 'react';

import { apiClient, getApiError } from '../../../shared/api';

export const mapPromotionToViewModel = (raw) => ({
  raw,
  id: raw?._id || raw?.id,
  title: raw?.title || 'Promoción',
  description: raw?.description || '',
  couponCode: raw?.couponCode || null,
  discount: Number(raw?.discountPercentage ?? 0),
  startDate: raw?.startDate || null,
  endDate: raw?.endDate || null,
  restaurantId: raw?.restaurantId?._id || raw?.restaurantId || null,
  restaurantName: raw?.restaurantId?.restaurantName || '',
});

// Promociones activas y aprobadas (endpoint público /promotions/active).
export function usePromotions() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPromotions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.get('/promotions/active', { params: { page: 1, limit: 50 } });
      const list = res.data?.data || res.data?.promotions || res.data || [];
      setPromotions(Array.isArray(list) ? list.map(mapPromotionToViewModel) : []);
    } catch (err) {
      setError(getApiError(err, 'No fue posible cargar las promociones'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  return { promotions, loading, error, refetch: fetchPromotions };
}
