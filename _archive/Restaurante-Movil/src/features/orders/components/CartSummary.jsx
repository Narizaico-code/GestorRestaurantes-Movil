import { StyleSheet, Text, View } from 'react-native';

import { Card } from '../../../shared/components';
import { FONTS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { formatCurrency } from '../../../shared/utils/format';

// Bloque de subtotal / envío / total del carrito.
export function CartSummary({ subtotal, shipping, total }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  return (
    <Card style={styles.summary}>
      <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} styles={styles} />
      {shipping > 0 ? <SummaryRow label="Envío" value={formatCurrency(shipping)} styles={styles} /> : null}
      <View style={styles.divider} />
      <SummaryRow label="Total" value={formatCurrency(total)} styles={styles} strong />
    </Card>
  );
}

function SummaryRow({ label, value, styles, strong }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, strong && styles.summaryStrong]}>{label}</Text>
      <Text style={[styles.summaryValue, strong && styles.summaryStrong]}>{value}</Text>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  summary: { gap: SPACING.sm },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: colors.textSecondary },
  summaryValue: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.semibold, fontWeight: '700', color: colors.text },
  summaryStrong: { fontSize: FONT_SIZE.lg, fontFamily: FONTS.displayBold, fontWeight: '800', color: colors.text },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginVertical: SPACING.xs },
});
