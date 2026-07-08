import { useCallback, useEffect, useMemo, useState } from 'react';

import { apiClient, getApiError } from '../../../shared/api';
import { MENU_CATEGORY_ORDER, MENU_CATEGORY_LABELS } from '../../../shared/constants';

export const mapMenuToViewModel = (raw) => ({
  raw,
  id: raw?._id || raw?.id,
  name: raw?.menuName || 'Platillo',
  description: raw?.menuDescription || '',
  price: Number(raw?.menuPrice ?? 0),
  category: raw?.menuCategory || 'PLATO_FUERTE',
  image: raw?.menuPhoto || null,
  isAvailable: raw?.menuAvailable !== false,
  isActive: raw?.menuActive !== false,
  restaurantId: raw?.restaurantId?._id || raw?.restaurantId,
});

// Carta de un restaurante (endpoint público /menus?restaurantId=).
export function useMenus(restaurantId, filters = {}) {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);

  const query = (filters.query || '').trim().toLowerCase();
  const category = filters.category || 'ALL';
  const onlyAvailable = Boolean(filters.onlyAvailable);
  const pollingIntervalMs = filters.pollingIntervalMs || 15000;

  const fetchMenus = useCallback(async () => {
    if (!restaurantId) return;
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.get('/menus', { params: { restaurantId, menuActive: true } });
      const list = res.data?.menus || res.data?.data || res.data || [];
      setMenus(Array.isArray(list) ? list.map(mapMenuToViewModel) : []);
      setLastUpdatedAt(new Date());
    } catch (err) {
      setError(getApiError(err, 'No fue posible cargar la carta'));
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  useEffect(() => {
    if (!restaurantId) return undefined;
    const timer = setInterval(fetchMenus, pollingIntervalMs);
    return () => clearInterval(timer);
  }, [restaurantId, fetchMenus, pollingIntervalMs]);

  const filteredMenus = useMemo(() => {
    return menus.filter((menu) => {
      if (onlyAvailable && !menu.isAvailable) return false;
      if (category !== 'ALL' && menu.category !== category) return false;
      if (!query) return true;
      return menu.name.toLowerCase().includes(query) || menu.description.toLowerCase().includes(query);
    });
  }, [menus, onlyAvailable, category, query]);

  // Agrupa la carta por categoría en el orden canónico, omitiendo categorías vacías.
  const sections = useMemo(() => {
    return MENU_CATEGORY_ORDER.map((category) => ({
      category,
      title: MENU_CATEGORY_LABELS[category] || category,
      data: filteredMenus.filter((m) => m.category === category),
    })).filter((section) => section.data.length > 0);
  }, [filteredMenus]);

  return {
    menus,
    filteredMenus,
    sections,
    loading,
    error,
    lastUpdatedAt,
    refetch: fetchMenus,
  };
}
