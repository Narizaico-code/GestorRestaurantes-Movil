import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Badge, Card } from '../../../shared/components';
import { ORDER_TYPES } from '../../../shared/constants';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { formatCurrency, formatDateTime } from '../../../shared/utils/format';

export function OrderDetailScreen({ route }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const order = route.params?.order;

  if (!order) return null;

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
        <DetailRow icon="lunch-dining" label="Tipo de pedido" value={order.orderTypeLabel} colors={colors} />
        {order.orderType === ORDER_TYPES.A_DOMICILIO && order.deliveryAddress ? (
          <DetailRow icon="location-on" label="Entrega" value={order.deliveryAddress} colors={colors} />
        ) : null}
        {order.coupon ? <DetailRow icon="local-offer" label="Cupón" value={order.coupon} colors={colors} /> : null}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatCurrency(order.total)}</Text>
        </View>
      </Card>
    </ScrollView>
  );
}

function DetailRow({ icon, label, value, colors }) {
  const styles = createStyles(colors);
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailLeft}>
        <MaterialIcons name={icon} size={18} color={colors.primary} />
        <Text style={styles.detailLabel}>{label}</Text>
      </View>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
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
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  detailLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  detailLabel: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: colors.textSecondary },
  detailValue: { flex: 1, textAlign: 'right', fontSize: FONT_SIZE.sm, fontFamily: FONTS.semibold, fontWeight: '700', color: colors.text },
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
