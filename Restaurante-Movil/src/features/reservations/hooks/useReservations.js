import { useCallback, useEffect, useState } from 'react';

import { apiClient, buildFormData, getApiError } from '../../../shared/api';
import { mapReservationToViewModel } from '../utils/reservationMapper';

export { mapReservationToViewModel } from '../utils/reservationMapper';

// Reservaciones del usuario autenticado: listado, creación, edición y cancelación.
export function useReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.get('/reservations/my-reservations');
      const list = res.data?.reservations || res.data?.data || res.data || [];
      const mapped = (Array.isArray(list) ? list : []).map(mapReservationToViewModel);
      // Más próximas primero.
      mapped.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
      setReservations(mapped);
    } catch (err) {
      setError(getApiError(err, 'No fue posible cargar tus reservaciones'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // Crea una reservación (multipart: puede llevar foto y tableId como array).
  const createReservation = useCallback(
    async (payload) => {
      try {
        const formData = await buildFormData(payload, payload.photo ? { uri: payload.photo, field: 'photo' } : null);
        const res = await apiClient.post('/reservations/create', formData);
        await fetchReservations();
        return { ok: true, data: res.data };
      } catch (err) {
        return { ok: false, error: getApiError(err, 'No fue posible crear la reservación') };
      }
    },
    [fetchReservations]
  );

  // Edita una reservación propia (PUT /reservations/:id, mismos campos que create).
  const updateReservation = useCallback(
    async (id, payload) => {
      try {
        const formData = await buildFormData(payload, payload.photo ? { uri: payload.photo, field: 'photo' } : null);
        const res = await apiClient.put(`/reservations/${id}`, formData);
        await fetchReservations();
        return { ok: true, data: res.data };
      } catch (err) {
        return { ok: false, error: getApiError(err, 'No fue posible actualizar la reservación') };
      }
    },
    [fetchReservations]
  );

  // Cancela una reservación propia (PUT /reservations/:id con status).
  const cancelReservation = useCallback(
    async (id) => {
      try {
        await apiClient.put(`/reservations/${id}`, { status: 'CANCELADO' });
        await fetchReservations();
        return { ok: true };
      } catch (err) {
        return { ok: false, error: getApiError(err, 'No fue posible cancelar la reservación') };
      }
    },
    [fetchReservations]
  );

  return {
    reservations,
    loading,
    error,
    refetch: fetchReservations,
    createReservation,
    updateReservation,
    cancelReservation,
  };
}
