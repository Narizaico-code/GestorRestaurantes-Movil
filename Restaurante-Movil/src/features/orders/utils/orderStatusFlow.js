import { ORDER_STATUS, ORDER_STATUS_LABELS } from '../../../shared/constants';

// Progresión normal de un pedido (CANCELADO se maneja aparte, es un estado terminal).
export const ORDER_STATUS_STEPS = [
  { value: ORDER_STATUS.EN_PREPARACION, label: ORDER_STATUS_LABELS.EN_PREPARACION, icon: 'soup-kitchen' },
  { value: ORDER_STATUS.LISTO, label: ORDER_STATUS_LABELS.LISTO, icon: 'inventory' },
  { value: ORDER_STATUS.ENTREGADO, label: ORDER_STATUS_LABELS.ENTREGADO, icon: 'task-alt' },
];

// Índice del paso activo dentro de ORDER_STATUS_STEPS (-1 si no aplica, ej. CANCELADO).
export const getActiveStepIndex = (status) =>
  ORDER_STATUS_STEPS.findIndex((step) => step.value === status);

export const isOrderCancelled = (status) => status === ORDER_STATUS.CANCELADO;

// Un pedido solo se puede cancelar mientras el restaurante no lo haya empezado a preparar...
// en este caso, mientras siga EN_PREPARACION (regla que también aplica el backend).
export const isOrderCancellable = (status) => status === ORDER_STATUS.EN_PREPARACION;
