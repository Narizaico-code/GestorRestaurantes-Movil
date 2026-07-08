// Constantes de dominio (literales exactos que espera el backend). Case-sensitive.

export { SPACING, FONT_SIZE, RADIUS, SHADOWS } from './theme';
export { ENDPOINTS } from './endpoints';

// --- Roles ---
export const ROLES = {
  ADMIN: 'ADMIN_ROLE',
  USER: 'USER_ROLE',
  ADMIN_RESTAURANT: 'ADMIN_RESTAURANT',
};

// --- Categorías de menú (enum del backend) ---
export const MENU_CATEGORIES = {
  ENTRADA: 'ENTRADA',
  PLATO_FUERTE: 'PLATO_FUERTE',
  POSTRE: 'POSTRE',
  BEBIDA: 'BEBIDA',
};

export const MENU_CATEGORY_LABELS = {
  ENTRADA: 'Entradas',
  PLATO_FUERTE: 'Platos fuertes',
  POSTRE: 'Postres',
  BEBIDA: 'Bebidas',
};

export const MENU_CATEGORY_ICONS = {
  ENTRADA: 'ramen-dining',
  PLATO_FUERTE: 'restaurant',
  POSTRE: 'icecream',
  BEBIDA: 'local-bar',
};

// Orden de presentación de las categorías en la carta.
export const MENU_CATEGORY_ORDER = ['ENTRADA', 'PLATO_FUERTE', 'POSTRE', 'BEBIDA'];

// --- Tipos de pedido (enum del backend) ---
export const ORDER_TYPES = {
  EN_RESTAURANTE: 'EN_RESTAURANTE',
  A_DOMICILIO: 'A_DOMICILIO',
  PARA_LLEVAR: 'PARA_LLEVAR',
};

export const ORDER_TYPE_OPTIONS = [
  { value: ORDER_TYPES.EN_RESTAURANTE, label: 'En restaurante' },
  { value: ORDER_TYPES.A_DOMICILIO, label: 'A domicilio' },
  { value: ORDER_TYPES.PARA_LLEVAR, label: 'Para llevar' },
];

export const ORDER_TYPE_LABELS = {
  EN_RESTAURANTE: 'En restaurante',
  A_DOMICILIO: 'A domicilio',
  PARA_LLEVAR: 'Para llevar',
};

// Costo fijo de envío para pedidos a domicilio (coincide con el backend).
export const SHIPPING_FEE = 20;

// --- Estados de pedido (enum del backend) ---
export const ORDER_STATUS = {
  EN_PREPARACION: 'EN_PREPARACION',
  LISTO: 'LISTO',
  ENTREGADO: 'ENTREGADO',
  CANCELADO: 'CANCELADO',
};

export const ORDER_STATUS_LABELS = {
  EN_PREPARACION: 'En preparación',
  LISTO: 'Listo',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
};

export const ORDER_STATUS_TONES = {
  EN_PREPARACION: 'warning',
  LISTO: 'info',
  ENTREGADO: 'success',
  CANCELADO: 'danger',
};

// --- Tipos de reservación (enum del backend) ---
export const RESERVATION_TYPES = {
  PERSONAL: 'PERSONAL',
  EVENTO: 'EVENTO',
};

export const RESERVATION_TYPE_OPTIONS = [
  { value: RESERVATION_TYPES.PERSONAL, label: 'Personal' },
  { value: RESERVATION_TYPES.EVENTO, label: 'Evento' },
];

export const RESERVATION_TYPE_LABELS = {
  PERSONAL: 'Personal',
  EVENTO: 'Evento',
};

// --- Estados de reservación (enum del backend) ---
export const RESERVATION_STATUS = {
  PENDIENTE: 'PENDIENTE',
  COMPLETADO: 'COMPLETADO',
  CANCELADO: 'CANCELADO',
};

export const RESERVATION_STATUS_LABELS = {
  PENDIENTE: 'Pendiente',
  COMPLETADO: 'Completado',
  CANCELADO: 'Cancelado',
};

export const RESERVATION_STATUS_TONES = {
  PENDIENTE: 'warning',
  COMPLETADO: 'success',
  CANCELADO: 'danger',
};

// Moneda por defecto (Quetzal guatemalteco).
export const CURRENCY = 'GTQ';
