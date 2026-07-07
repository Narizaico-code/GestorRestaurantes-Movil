// Utilidades de formato (es-GT).

import { CURRENCY } from '../constants';

export const formatCurrency = (amount, currency = CURRENCY) => {
  if (amount === undefined || amount === null || Number.isNaN(Number(amount))) {
    return 'N/D';
  }
  try {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount));
  } catch {
    return `${currency} ${Number(amount).toFixed(2)}`;
  }
};

export const formatNumber = (amount) => {
  if (amount === undefined || amount === null || Number.isNaN(Number(amount))) {
    return 'N/D';
  }
  return new Intl.NumberFormat('es-GT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount));
};

export const formatDate = (value) => {
  if (!value) return 'N/D';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/D';
  return date.toLocaleDateString('es-GT', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const formatTime = (value) => {
  if (!value) return 'N/D';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/D';
  return date.toLocaleTimeString('es-GT', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateTime = (value) => {
  if (!value) return 'N/D';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/D';
  return date.toLocaleString('es-GT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getOptionLabel = (value, options = []) => {
  const match = options.find((option) => option.value === value);
  return match?.label || value || 'N/D';
};

// Filtra caracteres no numéricos y limita la longitud (ej. teléfono de 8 dígitos).
export const sanitizeDigits = (value, maxLength) => {
  const digits = String(value || '').replace(/\D/g, '');
  return maxLength ? digits.slice(0, maxLength) : digits;
};

// Combina una fecha (AAAA-MM-DD) y hora (HH:mm) en un objeto Date válido, o null.
export const combineDateTime = (dateStr, timeStr) => {
  if (!dateStr) return null;
  const iso = `${dateStr}T${timeStr && /^\d{1,2}:\d{2}$/.test(timeStr) ? timeStr : '00:00'}:00`;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
};
