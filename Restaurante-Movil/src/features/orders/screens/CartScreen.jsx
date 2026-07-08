import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Button, Card, DetailRow, EmptyState, Input, Selector, Stepper } from '../../../shared/components';
import { ORDER_TYPES, SHIPPING_FEE } from '../../../shared/constants';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { useCartStore } from '../../../shared/store/cartStore';
import { notify } from '../../../shared/utils/confirm';
import { formatCurrency } from '../../../shared/utils/format';
import { useOrders } from '../hooks/useOrders';

// Pedir desde el móvil: para llevar o a domicilio (comer en el restaurante lo
// gestiona el mesero con una mesa asignada).
const CART_ORDER_TYPES = [
  { value: ORDER_TYPES.PARA_LLEVAR, label: 'Para llevar' },
  { value: ORDER_TYPES.A_DOMICILIO, label: 'A domicilio' },
];

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

        {items.map((item) => (
          <Card key={item.menuId} style={styles.itemCard}>
            {item.menuPhoto ? (
              <Image source={{ uri: item.menuPhoto }} style={styles.thumb} />
            ) : (
              <View style={[styles.thumb, styles.thumbPlaceholder]}>
                <MaterialIcons name="restaurant-menu" size={18} color={colors.primary} />
              </View>
            )}
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={1}>{item.menuName}</Text>
              <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
            </View>
            <View style={styles.itemActions}>
              <Stepper value={item.quantity} onChange={(q) => setQuantity(item.menuId, q)} />
              <TouchableOpacity onPress={() => removeItem(item.menuId)} hitSlop={8}>
                <MaterialIcons name="delete-outline" size={20} color={colors.danger} />
              </TouchableOpacity>
            </View>
          </Card>
        ))}

        <Selector label="Tipo de pedido" options={CART_ORDER_TYPES} value={orderType} onChange={setOrderType} />

        {orderType === ORDER_TYPES.A_DOMICILIO ? (
          <Input
            label="Dirección de entrega"
            leftIcon="location-on"
            placeholder="Calle, número, referencias"
            value={deliveryAddress}
            onChangeText={setDeliveryAddress}
            multiline
          />
        ) : null}

        <Input
          label="Cupón (opcional)"
          leftIcon="local-offer"
          autoCapitalize="characters"
          placeholder="CÓDIGO"
          value={coupon}
          onChangeText={setCoupon}
        />

        <Card style={styles.summary}>
          <DetailRow label="Subtotal" value={formatCurrency(subtotal)} bordered={false} />
          {shipping > 0 ? <DetailRow label="Envío" value={formatCurrency(shipping)} bordered={false} /> : null}
          <View style={styles.divider} />
          <DetailRow label="Total" value={formatCurrency(total)} bordered={false} strong />
        </Card>

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
  itemCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  thumb: { width: 48, height: 48, borderRadius: RADIUS.md, backgroundColor: colors.surfaceAlt },
  thumbPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  itemInfo: { flex: 1, gap: 2 },
  itemName: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.semibold, fontWeight: '700', color: colors.text },
  itemPrice: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.bold, fontWeight: '800', color: colors.primary },
  itemActions: { alignItems: 'flex-end', gap: SPACING.xs },
  summary: { gap: SPACING.sm },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginVertical: SPACING.xs },
});
