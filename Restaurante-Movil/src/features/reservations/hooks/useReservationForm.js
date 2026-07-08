import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { RESERVATION_TYPES } from '../../../shared/constants';
import { notify } from '../../../shared/utils/confirm';
import { toDateInputValue, toTimeInputValue } from '../../../shared/utils/format';
import { buildReservationPayload, validateReservationForm } from '../utils/reservationPayload';
import { useReservations } from './useReservations';

const defaultsFor = (reservation) =>
  reservation
    ? {
        numberPeople: String(reservation.numberPeople),
        date: toDateInputValue(reservation.startDate),
        startTime: toTimeInputValue(reservation.startDate),
        endTime: toTimeInputValue(reservation.endDate),
        description: reservation.description || '',
        coupon: reservation.coupon || '',
      }
    : { numberPeople: '2', date: '', startTime: '', endTime: '', description: '', coupon: '' };

// Hook compartido por NewReservationScreen y EditReservationScreen: mismo formulario,
// solo cambia si el submit crea o actualiza.
export function useReservationForm({ mode, restaurant, reservation, onSuccess }) {
  const isEdit = mode === 'edit';
  const { createReservation, updateReservation } = useReservations();

  const restaurantId = isEdit ? reservation?.restaurantId : restaurant?.id;

  const [type, setType] = useState(isEdit ? reservation.type : RESERVATION_TYPES.PERSONAL);
  const [selectedTables, setSelectedTables] = useState(isEdit ? reservation.tableIds : []);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm({ defaultValues: defaultsFor(isEdit ? reservation : null) });

  const toggleTable = (tableId) => {
    setSelectedTables((prev) =>
      prev.includes(tableId) ? prev.filter((id) => id !== tableId) : [...prev, tableId]
    );
  };

  const submit = form.handleSubmit(async (values) => {
    if (!restaurantId) {
      notify('Error', 'No se identificó el restaurante.');
      return;
    }

    const validation = validateReservationForm(values, type, selectedTables);
    if (!validation.ok) {
      notify(isEdit ? 'Reservación inválida' : 'No se pudo reservar', validation.message);
      return;
    }

    const payload = buildReservationPayload({
      restaurantId,
      selectedTables,
      values,
      type,
      start: validation.start,
      end: validation.end,
    });

    setSubmitting(true);
    const result = isEdit ? await updateReservation(reservation.id, payload) : await createReservation(payload);
    setSubmitting(false);

    if (!result.ok) {
      notify(isEdit ? 'No se pudo actualizar' : 'No se pudo reservar', result.error);
      return;
    }
    onSuccess?.();
  });

  return {
    control: form.control,
    errors: form.formState.errors,
    type,
    setType,
    selectedTables,
    toggleTable,
    submit,
    submitting,
    restaurantId,
  };
}
