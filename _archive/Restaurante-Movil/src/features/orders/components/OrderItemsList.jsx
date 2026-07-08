import { StyleSheet, Text, View } from 'react-native';

import { Card } from '../../../shared/components';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { formatCurrency } from '../../../shared/utils/format';

// Lista de artículos de un pedido, usada en el detalle.
export function OrderItemsList({ items }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  return (
    <Card style={styles.card}>
      <Text style={styles.sectionLabel}>Artículos</Text>
      {items.map((item, index) => (
        <View key={`${item.menuName}-${index}`} style={styles.itemRow}>
          <View style={styles.qtyPill}>
            <Text style={styles.qtyText}>{item.quantity}x</Text>
          </View>
          <Text style={styles.itemName} numberOfLines={1}>{item.menuName}</Text>
          <Text style={styles.itemPrice}>{formatCurrency(item.price * item.quantity)}</Text>
        </View>
      ))}
    </Card>
  );
}

const createStyles = (colors) => StyleSheet.create({
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
});
