import { RESERVATION_TYPES } from '../../../shared/constants';
import { combineDateTime } from '../../../shared/utils/format';

// Valida los campos del formulario de reservación (alta o edición).
// Devuelve { ok: true, start, end } o { ok: false, message }.
export const validateReservationForm = (values, type, selectedTables) => {
  if (selectedTables.length === 0) {
    return { ok: false, message: 'Debes elegir al menos una mesa disponible.' };
  }

  const start = combineDateTime(values.date, values.startTime);
  const end = combineDateTime(values.date, values.endTime);
  if (!start || !end) {
    return { ok: false, message: 'Revisa la fecha (AAAA-MM-DD) y las horas (HH:mm).' };
  }
  if (end <= start) {
    return { ok: false, message: 'La hora de fin debe ser posterior a la de inicio.' };
  }
  if (type === RESERVATION_TYPES.EVENTO && !values.description.trim()) {
    return { ok: false, message: 'La descripción es obligatoria para reservaciones tipo evento.' };
  }

  return { ok: true, start, end };
};

// Arma el payload que espera el backend (create y update usan la misma forma).
export const buildReservationPayload = ({ restaurantId, selectedTables, values, type, start, end }) => ({
  restaurantId,
  tableId: selectedTables,
  numberPeople: Number(values.numberPeople) || 1,
  typeReservation: type,
  description: values.description.trim(),
  coupon: values.coupon.trim(),
  startDate: start.toISOString(),
  endDate: end.toISOString(),
});
