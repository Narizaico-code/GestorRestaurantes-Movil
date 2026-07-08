import { useCallback, useEffect, useState } from 'react';

import { apiClient, getApiError } from '../../../shared/api';

export const mapTableToViewModel = (raw) => ({
  raw,
  id: raw?._id || raw?.id,
  name: raw?.tableName || 'Mesa',
  capacity: Number(raw?.tableCapacity ?? 0),
  isActive: raw?.tableActive !== false,
  restaurantId: raw?.restaurantId?._id || raw?.restaurantId,
});

// Mesas de un restaurante (requiere sesión). Se usa al crear una reservación.
export function useTables(restaurantId) {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTables = useCallback(async () => {
    if (!restaurantId) return;
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.get('/tables', { params: { restaurantId, tableActive: true } });
      const list = res.data?.tables || res.data?.data || res.data || [];
      const mapped = (Array.isArray(list) ? list : [])
        .map(mapTableToViewModel)
        // Defensa extra: el backend puede no filtrar por restaurante.
        .filter((t) => t.isActive && (!restaurantId || String(t.restaurantId) === String(restaurantId)));
      setTables(mapped);
    } catch (err) {
      setError(getApiError(err, 'No fue posible cargar las mesas'));
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  return { tables, loading, error, refetch: fetchTables };
}
