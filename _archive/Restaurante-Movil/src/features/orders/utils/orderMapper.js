import { ORDER_STATUS_LABELS, ORDER_STATUS_TONES, ORDER_TYPE_LABELS } from '../../../shared/constants';

// Normaliza la respuesta cruda del backend a un view model listo para la UI.
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
