import { useCallback, useEffect, useState } from 'react';

import { apiClient, getApiError } from '../../../shared/api';
import { mapOrderToViewModel } from '../utils/orderMapper';

export { mapOrderToViewModel } from '../utils/orderMapper';

// Pedidos del usuario autenticado: listado, creación y cancelación.
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

  // Cancela un pedido propio, solo permitido mientras sigue EN_PREPARACION.
  const cancelOrder = useCallback(
    async (id) => {
      try {
        const res = await apiClient.put(`/orders/my-order/${id}/cancel`);
        await fetchOrders();
        return { ok: true, data: res.data };
      } catch (err) {
        return { ok: false, error: getApiError(err, 'No fue posible cancelar el pedido') };
      }
    },
    [fetchOrders]
  );

  return { orders, loading, error, refetch: fetchOrders, createOrder, cancelOrder };
}
