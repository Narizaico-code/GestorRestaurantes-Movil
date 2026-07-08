import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Badge, Card } from '../../../shared/components';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { formatCurrency, formatDateTime } from '../../../shared/utils/format';

// Tarjeta de un pedido en el listado "Mis Pedidos".
export function OrderListItem({ order, onPress }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.row}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="receipt-long" size={20} color={colors.primary} />
            </View>
            <Text style={styles.restaurant} numberOfLines={1}>{order.restaurantName}</Text>
          </View>
          <Badge label={order.statusLabel} tone={order.statusTone} />
        </View>

        <View style={styles.metaRow}>
          <MaterialIcons name="lunch-dining" size={14} color={colors.textMuted} />
          <Text style={styles.meta}>{order.itemCount} artículo(s) · {order.orderTypeLabel}</Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.date}>{formatDateTime(order.createdAt)}</Text>
          <Text style={styles.total}>{formatCurrency(order.total)}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const createStyles = (colors) => StyleSheet.create({
  card: { gap: SPACING.xs },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, flex: 1, marginRight: SPACING.sm },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restaurant: { flex: 1, fontSize: FONT_SIZE.md, fontFamily: FONTS.semibold, fontWeight: '700', color: colors.text },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: SPACING.xs },
  meta: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: colors.textSecondary },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  date: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.body, color: colors.textMuted },
  total: { fontSize: FONT_SIZE.md, fontFamily: FONTS.displayBold, fontWeight: '800', color: colors.primary },
});
