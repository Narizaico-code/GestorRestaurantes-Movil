import { useCallback, useEffect, useMemo, useState } from 'react';

import { apiClient, getApiError } from '../../../shared/api';

export const mapReviewToViewModel = (raw) => ({
  raw,
  id: raw?._id || raw?.id,
  rating: Number(raw?.rating ?? 0),
  comment: raw?.comment || '',
  userName: raw?.userName || 'Anónimo',
  userId: raw?.userId || null,
  createdAt: raw?.createdAt,
});

// Una reseña solo se puede editar dentro de los primeros 3 minutos de creada
// (debe coincidir con EDIT_WINDOW_MS del backend en review.controller.js).
export const REVIEW_EDIT_WINDOW_MS = 3 * 60 * 1000;

export const canEditReview = (review) => {
  if (!review?.createdAt) return false;
  return Date.now() - new Date(review.createdAt).getTime() < REVIEW_EDIT_WINDOW_MS;
};

/**
 * Reseñas de un restaurante o de un platillo.
 * @param {Object} target - { restaurantId } o { menuId }.
 */
export function useReviews({ restaurantId, menuId } = {}) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const path = menuId
    ? `/reviews/menu/${menuId}`
    : restaurantId
    ? `/reviews/restaurant/${restaurantId}`
    : null;

  const fetchReviews = useCallback(async () => {
    if (!path) return;
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.get(path);
      const list = res.data?.reviews || res.data?.data || res.data || [];
      setReviews(Array.isArray(list) ? list.map(mapReviewToViewModel) : []);
    } catch (err) {
      setError(getApiError(err, 'No fue posible cargar las reseñas'));
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Promedio de calificaciones (para el encabezado del restaurante/platillo).
  const average = useMemo(() => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / reviews.length;
  }, [reviews]);

  const createReview = useCallback(
    async ({ rating, comment, userName }) => {
      try {
        const payload = { rating, comment, userName };
        if (menuId) payload.menuId = menuId;
        if (restaurantId) payload.restaurantId = restaurantId;
        await apiClient.post('/reviews', payload);
        await fetchReviews();
        return { ok: true };
      } catch (err) {
        return { ok: false, error: getApiError(err, 'No fue posible enviar tu reseña') };
      }
    },
    [fetchReviews, menuId, restaurantId]
  );

  // Edita una reseña propia. El backend rechaza la petición si ya pasaron los 3
  // minutos de la ventana de edición o si no eres el autor.
  const updateReview = useCallback(
    async (reviewId, { rating, comment, userName }) => {
      try {
        await apiClient.put(`/reviews/${reviewId}`, { rating, comment, userName });
        await fetchReviews();
        return { ok: true };
      } catch (err) {
        return { ok: false, error: getApiError(err, 'No fue posible actualizar la reseña') };
      }
    },
    [fetchReviews]
  );

  // Elimina una reseña propia (el backend valida que seas el autor o admin).
  const deleteReview = useCallback(
    async (reviewId) => {
      try {
        await apiClient.delete(`/reviews/${reviewId}`);
        await fetchReviews();
        return { ok: true };
      } catch (err) {
        return { ok: false, error: getApiError(err, 'No fue posible eliminar la reseña') };
      }
    },
    [fetchReviews]
  );

  return {
    reviews,
    average,
    count: reviews.length,
    loading,
    error,
    refetch: fetchReviews,
    createReview,
    updateReview,
    deleteReview,
  };
}
