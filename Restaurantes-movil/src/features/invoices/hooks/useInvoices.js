import { useCallback, useEffect, useState } from 'react';

import { apiClient, getApiError } from '../../../shared/api';
import { ORDER_STATUS_LABELS, ORDER_STATUS_TONES } from '../../../shared/constants';

export const mapInvoiceToViewModel = (raw) => {
  const orderStatus = raw?.orderId?.status || null;
  return {
    raw,
    id: raw?._id || raw?.id,
    invoiceNumber: raw?.invoiceNumber || raw?._id || 'Factura',
    restaurantName: raw?.restaurantId?.restaurantName || 'Restaurante',
    issuedAt: raw?.issuedAt || raw?.createdAt || null,
    total: Number(raw?.total ?? 0),
    subtotal: Number(raw?.subtotal ?? 0),
    shippingFee: Number(raw?.shippingFee ?? 0),
    discountAmount: Number(raw?.discountAmount ?? 0),
    coupon: raw?.coupon || null,
    orderStatus,
    orderStatusLabel: ORDER_STATUS_LABELS[orderStatus] || 'Emitida',
    orderStatusTone: ORDER_STATUS_TONES[orderStatus] || 'info',
  };
};

export function useInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.get('/invoices/my-invoices');
      const list = res.data?.invoices || res.data?.data || res.data || [];
      setInvoices(Array.isArray(list) ? list.map(mapInvoiceToViewModel) : []);
    } catch (err) {
      setError(getApiError(err, 'No fue posible cargar tus facturas'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  return { invoices, loading, error, refetch: fetchInvoices };
}
