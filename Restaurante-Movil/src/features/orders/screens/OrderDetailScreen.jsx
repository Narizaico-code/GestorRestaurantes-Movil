import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Badge, Card, DetailRow } from '../../../shared/components';
import { ORDER_TYPES } from '../../../shared/constants';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { formatCurrency, formatDateTime } from '../../../shared/utils/format';

export function OrderDetailScreen({ route }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const order = route.params?.order;

  if (!order) return null;

  const hasDelivery = order.orderType === ORDER_TYPES.A_DOMICILIO && Boolean(order.deliveryAddress);
  const hasCoupon = Boolean(order.coupon);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <View style={styles.flex}>
          <Text style={styles.title}>{order.restaurantName}</Text>
          <Text style={styles.date}>{formatDateTime(order.createdAt)}</Text>
        </View>
        <Badge label={order.statusLabel} tone={order.statusTone} />
      </View>

      <Card style={styles.card}>
        <Text style={styles.sectionLabel}>Artículos</Text>
        {order.items.map((item, index) => (
          <View key={`${item.menuName}-${index}`} style={styles.itemRow}>
            <View style={styles.qtyPill}>
              <Text style={styles.qtyText}>{item.quantity}x</Text>
            </View>
            <Text style={styles.itemName} numberOfLines={1}>{item.menuName}</Text>
            <Text style={styles.itemPrice}>{formatCurrency(item.price * item.quantity)}</Text>
          </View>
        ))}
      </Card>

      <Card style={styles.card}>
        <DetailRow
          icon="lunch-dining"
          label="Tipo de pedido"
          value={order.orderTypeLabel}
          last={!hasDelivery && !hasCoupon}
        />
        {hasDelivery ? (
          <DetailRow icon="location-on" label="Entrega" value={order.deliveryAddress} last={!hasCoupon} />
        ) : null}
        {hasCoupon ? <DetailRow icon="local-offer" label="Cupón" value={order.coupon} last /> : null}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatCurrency(order.total)}</Text>
        </View>
      </Card>
    </ScrollView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: SPACING.lg, gap: SPACING.md },
  flex: { flex: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: SPACING.md },
  title: { fontSize: FONT_SIZE.xl, fontFamily: FONTS.displayBold, fontWeight: '800', color: colors.text },
  date: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.body, color: colors.textMuted, marginTop: 2 },
  card: { gap: SPACING.sm },
  sectionLabel: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.semibold, fontWeight: '700', color: colors.textSecondary },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  qtyPill: {
    minWidth: 34,
    height: 26,
    borderRadius: RADIUS.sm,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xs,
  },
  qtyText: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.bold, fontWeight: '800', color: colors.primary },
  itemName: { flex: 1, fontSize: FONT_SIZE.sm, fontFamily: FONTS.medium, color: colors.text },
  itemPrice: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.semibold, fontWeight: '700', color: colors.text },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
    paddingTop: SPACING.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  totalLabel: { fontSize: FONT_SIZE.md, fontFamily: FONTS.semibold, fontWeight: '700', color: colors.text },
  totalValue: { fontSize: FONT_SIZE.xl, fontFamily: FONTS.displayBold, fontWeight: '800', color: colors.primary },
});
