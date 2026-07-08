import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Button, EmptyState } from '../../../shared/components';
import { ORDER_TYPES, SHIPPING_FEE } from '../../../shared/constants';
import { FONTS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { useCartStore } from '../../../shared/store/cartStore';
import { notify } from '../../../shared/utils/confirm';
import { CartItemsList } from '../components/CartItemsList';
import { CartOrderTypeFields } from '../components/CartOrderTypeFields';
import { CartSummary } from '../components/CartSummary';
import { useOrders } from '../hooks/useOrders';

export function CartScreen({ navigation }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const { createOrder } = useOrders();

  const items = useCartStore((s) => s.items);
  const restaurantId = useCartStore((s) => s.restaurantId);
  const restaurantName = useCartStore((s) => s.restaurantName);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);

  const [orderType, setOrderType] = useState(ORDER_TYPES.PARA_LLEVAR);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [coupon, setCoupon] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const shipping = orderType === ORDER_TYPES.A_DOMICILIO ? SHIPPING_FEE : 0;
  const total = subtotal + shipping;

  const placeOrder = async () => {
    if (items.length === 0) return;
    if (orderType === ORDER_TYPES.A_DOMICILIO && !deliveryAddress.trim()) {
      notify('Falta la dirección', 'Ingresa la dirección de entrega para pedidos a domicilio.');
      return;
    }
    setSubmitting(true);
    const result = await createOrder({
      restaurantId,
      items,
      orderType,
      deliveryAddress: deliveryAddress.trim(),
      coupon: coupon.trim(),
    });
    setSubmitting(false);
    if (!result.ok) {
      notify('No se pudo crear el pedido', result.error);
      return;
    }
    clear();
    notify('¡Pedido confirmado!', 'Tu pedido fue enviado al restaurante.', () => navigation.navigate('MyOrders'));
  };

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="shopping-cart"
          title="Tu carrito está vacío"
          message="Explora un restaurante y agrega platillos para hacer tu pedido."
          action={
            <Button
              title="Ver restaurantes"
              onPress={() => navigation.navigate('Restaurantes', { screen: 'RestaurantsList' })}
            />
          }
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.restaurantRow}>
          <MaterialIcons name="storefront" size={18} color={colors.primary} />
          <Text style={styles.restaurantName}>{restaurantName}</Text>
        </View>

        <CartItemsList items={items} onChangeQuantity={setQuantity} onRemove={removeItem} />

        <CartOrderTypeFields
          orderType={orderType}
          onChangeOrderType={setOrderType}
          deliveryAddress={deliveryAddress}
          onChangeDeliveryAddress={setDeliveryAddress}
          coupon={coupon}
          onChangeCoupon={setCoupon}
        />

        <CartSummary subtotal={subtotal} shipping={shipping} total={total} />

        <Button title="Confirmar pedido" gradient onPress={placeOrder} loading={submitting} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: SPACING.lg, gap: SPACING.md },
  restaurantRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  restaurantName: { fontSize: FONT_SIZE.md, fontFamily: FONTS.semibold, fontWeight: '700', color: colors.text },
});
