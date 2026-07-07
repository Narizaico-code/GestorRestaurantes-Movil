import { useCallback, useEffect, useState } from 'react';

import { apiClient, getApiError } from '../../../shared/api';
import { ORDER_STATUS_LABELS, ORDER_STATUS_TONES, ORDER_TYPE_LABELS } from '../../../shared/constants';

export const mapOrderToViewModel = (raw) => {
  const status = raw?.status || 'EN_PREPARACION';
  const orderType = raw?.orderType || 'EN_RESTAURANTE';
  const items = Array.isArray(raw?.items) ? raw.items : [];
  return {
    raw,
    id: raw?._id || raw?.id,
    restaurantName: raw?.restaurantId?.restaurantName || 'Restaurante',
    items: items.map((it) => ({
      menuName: it?.menuId?.menuName || it?.menuName || 'Platillo',
      quantity: Number(it?.quantity ?? 1),
      price: Number(it?.price ?? 0),
    })),
    itemCount: items.reduce((sum, it) => sum + Number(it?.quantity ?? 0), 0),
    total: Number(raw?.total ?? 0),
    coupon: raw?.coupon || null,
    orderType,
    orderTypeLabel: ORDER_TYPE_LABELS[orderType] || orderType,
    deliveryAddress: raw?.deliveryAddress || null,
    status,
    statusLabel: ORDER_STATUS_LABELS[status] || status,
    statusTone: ORDER_STATUS_TONES[status] || 'neutral',
    createdAt: raw?.createdAt,
  };
};

// Pedidos del usuario autenticado + creación desde el carrito.
export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.get('/orders/my-orders');
      const list = res.data?.orders || res.data?.data || res.data || [];
      setOrders(Array.isArray(list) ? list.map(mapOrderToViewModel) : []);
    } catch (err) {
      setError(getApiError(err, 'No fue posible cargar tus pedidos'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Crea un pedido como cliente (POST /orders/my-order).
  const createOrder = useCallback(
    async ({ restaurantId, tableId, items, orderType, deliveryAddress, coupon }) => {
      try {
        const payload = {
          restaurantId,
          items: items.map((it) => ({ menuId: it.menuId, quantity: it.quantity })),
          orderType,
        };
        if (tableId) payload.tableId = tableId;
        if (deliveryAddress) payload.deliveryAddress = deliveryAddress;
        if (coupon) payload.coupon = coupon;

        const res = await apiClient.post('/orders/my-order', payload);
        await fetchOrders();
        return { ok: true, data: res.data };
      } catch (err) {
        return { ok: false, error: getApiError(err, 'No fue posible crear el pedido') };
      }
    },
    [fetchOrders]
  );

  return { orders, loading, error, refetch: fetchOrders, createOrder };
}
