import { StyleSheet, Text, View } from 'react-native';

import { Card, DetailRow } from '../../../shared/components';
import { ORDER_TYPES } from '../../../shared/constants';
import { FONTS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { formatCurrency } from '../../../shared/utils/format';

// Tipo de pedido, dirección de entrega, cupón y total. Usado en el detalle del pedido.
export function OrderInfoCard({ order }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  return (
    <Card style={styles.card}>
      <DetailRow icon="lunch-dining" label="Tipo de pedido" value={order.orderTypeLabel} />
      {order.orderType === ORDER_TYPES.A_DOMICILIO && order.deliveryAddress ? (
        <DetailRow icon="location-on" label="Entrega" value={order.deliveryAddress} />
      ) : null}
      {order.coupon ? <DetailRow icon="local-offer" label="Cupón" value={order.coupon} last /> : null}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{formatCurrency(order.total)}</Text>
      </View>
    </Card>
  );
}

const createStyles = (colors) => StyleSheet.create({
  card: { gap: 0 },
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
