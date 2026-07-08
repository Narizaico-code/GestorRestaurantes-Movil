import { useCallback, useEffect, useState } from 'react';

import { apiClient, getApiError } from '../../../shared/api';
import { MENU_CATEGORY_LABELS } from '../../../shared/constants';
import { formatCurrency } from '../../../shared/utils/format';

const EMPTY_SUMMARY = {
  categories: [],
  categoryCodes: [],
  minPrice: null,
  maxPrice: null,
  priceRangeLabel: 'Sin precios',
  hasAvailableMenu: false,
  availableMenusCount: 0,
  totalMenusCount: 0,
};

const toPriceRangeLabel = (minPrice, maxPrice) => {
  if (typeof minPrice !== 'number' || typeof maxPrice !== 'number') return 'Sin precios';
  if (minPrice === maxPrice) return formatCurrency(minPrice);
  return `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`;
};

const buildMenuSummaryByRestaurant = (menus = []) => {
  const summary = new Map();

  menus.forEach((menu) => {
    const restaurantId = menu?.restaurantId?._id || menu?.restaurantId;
    if (!restaurantId) return;

    if (!summary.has(String(restaurantId))) {
      summary.set(String(restaurantId), {
        categoryCodes: new Set(),
        minPrice: Number.POSITIVE_INFINITY,
        maxPrice: Number.NEGATIVE_INFINITY,
        hasPrice: false,
        hasAvailableMenu: false,
        availableMenusCount: 0,
        totalMenusCount: 0,
      });
    }

    const bucket = summary.get(String(restaurantId));
    const category = menu?.menuCategory;
    const price = Number(menu?.menuPrice);
    const isActive = menu?.menuActive !== false;
    const isAvailable = menu?.menuAvailable !== false;

    if (!isActive) return;

    bucket.totalMenusCount += 1;
    if (isAvailable) {
      bucket.hasAvailableMenu = true;
      bucket.availableMenusCount += 1;
    }
    if (category) bucket.categoryCodes.add(category);
    if (!Number.isNaN(price)) {
      bucket.hasPrice = true;
      bucket.minPrice = Math.min(bucket.minPrice, price);
      bucket.maxPrice = Math.max(bucket.maxPrice, price);
    }
  });

  const normalized = new Map();
  summary.forEach((value, key) => {
    const categoryCodes = Array.from(value.categoryCodes);
    const categories = categoryCodes.map((code) => MENU_CATEGORY_LABELS[code] || code);
    const minPrice = value.hasPrice ? value.minPrice : null;
    const maxPrice = value.hasPrice ? value.maxPrice : null;

    normalized.set(key, {
      categories,
      categoryCodes,
      minPrice,
      maxPrice,
      priceRangeLabel: toPriceRangeLabel(minPrice, maxPrice),
      hasAvailableMenu: value.hasAvailableMenu,
      availableMenusCount: value.availableMenusCount,
      totalMenusCount: value.totalMenusCount,
    });
  });

  return normalized;
};

// Capa "ViewModel": desacopla la UI de la forma exacta de la entidad del backend.
export const mapRestaurantToViewModel = (raw, summary = EMPTY_SUMMARY) => ({
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
  categories: summary.categories,
  categoryCodes: summary.categoryCodes,
  minPrice: summary.minPrice,
  maxPrice: summary.maxPrice,
  priceRangeLabel: summary.priceRangeLabel,
  hasAvailableMenu: summary.hasAvailableMenu,
  availableMenusCount: summary.availableMenusCount,
  totalMenusCount: summary.totalMenusCount,
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
      const [restaurantsRes, menusRes] = await Promise.all([
        apiClient.get('/restaurants', { params: { page: 1, limit: 50, restaurantActive: true } }),
        apiClient.get('/menus', { params: { menuActive: true } }),
      ]);

      const restaurantList = restaurantsRes.data?.data || restaurantsRes.data?.restaurants || restaurantsRes.data || [];
      const menuList = menusRes.data?.menus || menusRes.data?.data || menusRes.data || [];
      const summaryByRestaurant = buildMenuSummaryByRestaurant(Array.isArray(menuList) ? menuList : []);

      setRestaurants(
        Array.isArray(restaurantList)
          ? restaurantList.map((raw) => mapRestaurantToViewModel(raw, summaryByRestaurant.get(String(raw?._id || raw?.id)) || EMPTY_SUMMARY))
          : []
      );
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
