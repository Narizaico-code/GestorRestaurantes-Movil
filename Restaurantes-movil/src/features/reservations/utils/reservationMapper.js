import { RESERVATION_STATUS_LABELS, RESERVATION_STATUS_TONES } from '../../../shared/constants';

// Normaliza la respuesta cruda del backend a un view model listo para la UI.
export const mapReservationToViewModel = (raw) => {
  const status = raw?.status || 'PENDIENTE';
  const tables = Array.isArray(raw?.tableId) ? raw.tableId : raw?.tableId ? [raw.tableId] : [];
  return {
    raw,
    id: raw?._id || raw?.id,
    restaurantId: raw?.restaurantId?._id || raw?.restaurantId || null,
    restaurantName: raw?.restaurantId?.restaurantName || 'Restaurante',
    tableIds: tables.map((t) => (typeof t === 'object' ? t?._id : t)).filter(Boolean),
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
