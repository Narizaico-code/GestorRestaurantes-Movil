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
export function useMenus(restaurantId) {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMenus = useCallback(async () => {
    if (!restaurantId) return;
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.get('/menus', { params: { restaurantId, menuActive: true } });
      const list = res.data?.menus || res.data?.data || res.data || [];
      setMenus(Array.isArray(list) ? list.map(mapMenuToViewModel) : []);
    } catch (err) {
      setError(getApiError(err, 'No fue posible cargar la carta'));
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  // Agrupa la carta por categoría en el orden canónico, omitiendo categorías vacías.
  const sections = useMemo(() => {
    return MENU_CATEGORY_ORDER.map((category) => ({
      category,
      title: MENU_CATEGORY_LABELS[category] || category,
      data: menus.filter((m) => m.category === category),
    })).filter((section) => section.data.length > 0);
  }, [menus]);

  return { menus, sections, loading, error, refetch: fetchMenus };
}
