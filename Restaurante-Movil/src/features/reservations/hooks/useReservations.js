import { useCallback, useEffect, useState } from 'react';

import { apiClient, buildFormData, getApiError } from '../../../shared/api';
import { RESERVATION_STATUS_LABELS, RESERVATION_STATUS_TONES } from '../../../shared/constants';

export const mapReservationToViewModel = (raw) => {
  const status = raw?.status || 'PENDIENTE';
  const tables = Array.isArray(raw?.tableId) ? raw.tableId : raw?.tableId ? [raw.tableId] : [];
  return {
    raw,
    id: raw?._id || raw?.id,
    restaurantId: raw?.restaurantId?._id || raw?.restaurantId || null,
    restaurantName: raw?.restaurantId?.restaurantName || 'Restaurante',
    tables: tables.map((t) => (typeof t === 'object' ? t?.tableName || 'Mesa' : 'Mesa')),
    tableCount: tables.length,
    numberPeople: Number(raw?.numberPeople ?? 1),
    type: raw?.typeReservation || 'PERSONAL',
    description: raw?.description || '',
    coupon: raw?.coupon || null,
    startDate: raw?.startDate || null,
    endDate: raw?.endDate || null,
    photo: raw?.photo || null,
    status,
    statusLabel: RESERVATION_STATUS_LABELS[status] || status,
    statusTone: RESERVATION_STATUS_TONES[status] || 'neutral',
  };
};

// Reservaciones del usuario autenticado + creación.
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
    async (form) => {
      try {
        const formData = await buildFormData(
          {
            restaurantId: form.restaurantId,
            tableId: form.tableId, // array → se serializa a JSON
            numberPeople: form.numberPeople,
            typeReservation: form.typeReservation,
            description: form.description,
            coupon: form.coupon,
            startDate: form.startDate, // ISO string
            endDate: form.endDate,
          },
          form.photo ? { uri: form.photo, field: 'photo' } : null
        );
        const res = await apiClient.post('/reservations/create', formData);
        await fetchReservations();
        return { ok: true, data: res.data };
      } catch (err) {
        return { ok: false, error: getApiError(err, 'No fue posible crear la reservación') };
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

  return { reservations, loading, error, refetch: fetchReservations, createReservation, cancelReservation };
}
