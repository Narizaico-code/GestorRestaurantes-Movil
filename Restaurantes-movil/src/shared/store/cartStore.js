import { create } from 'zustand';

// Carrito en memoria. Un carrito pertenece a UN restaurante: si agregas un platillo
// de otro restaurante, el carrito se reemplaza (el backend crea un pedido por restaurante).
export const useCartStore = create((set, get) => ({
  restaurantId: null,
  restaurantName: '',
  items: [], // [{ menuId, menuName, price, quantity, menuPhoto }]

  // Agrega (o incrementa) un platillo. Cambiar de restaurante limpia el carrito.
  addItem: (restaurant, menu, quantity = 1) => {
    const state = get();
    const sameRestaurant = state.restaurantId === restaurant.id;
    const baseItems = sameRestaurant ? state.items : [];

    const existing = baseItems.find((it) => it.menuId === menu.id);
    let items;
    if (existing) {
      items = baseItems.map((it) =>
        it.menuId === menu.id ? { ...it, quantity: it.quantity + quantity } : it
      );
    } else {
      items = [
        ...baseItems,
        {
          menuId: menu.id,
          menuName: menu.name,
          price: Number(menu.price) || 0,
          quantity,
          menuPhoto: menu.image || null,
        },
      ];
    }

    set({ restaurantId: restaurant.id, restaurantName: restaurant.name, items });
  },

  setQuantity: (menuId, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        const items = state.items.filter((it) => it.menuId !== menuId);
        return items.length ? { items } : { items: [], restaurantId: null, restaurantName: '' };
      }
      return { items: state.items.map((it) => (it.menuId === menuId ? { ...it, quantity } : it)) };
    }),

  removeItem: (menuId) =>
    set((state) => {
      const items = state.items.filter((it) => it.menuId !== menuId);
      return items.length ? { items } : { items: [], restaurantId: null, restaurantName: '' };
    }),

  clear: () => set({ restaurantId: null, restaurantName: '', items: [] }),

  // Selectores derivados (usar con getState en pantallas no-reactivas).
  getCount: () => get().items.reduce((sum, it) => sum + it.quantity, 0),
  getSubtotal: () => get().items.reduce((sum, it) => sum + it.price * it.quantity, 0),
}));
