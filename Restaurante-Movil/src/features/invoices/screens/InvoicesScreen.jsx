import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Badge, Card, EmptyState, LoadingSpinner } from '../../../shared/components';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { formatCurrency, formatDateTime } from '../../../shared/utils/format';
import { useInvoices } from '../hooks/useInvoices';

export function InvoicesScreen() {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const { invoices, loading, error, refetch } = useInvoices();

  if (loading && invoices.length === 0) {
    return <LoadingSpinner message="Cargando facturas..." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={invoices}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={colors.primary} />}
        ListEmptyComponent={
          <EmptyState
            icon="receipt"
            title="Sin facturas"
            message={error || 'Aún no tienes facturas emitidas.'}
          />
        }
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.header}>
              <View style={styles.row}>
                <View style={styles.iconCircle}>
                  <MaterialIcons name="receipt" size={20} color={colors.primary} />
                </View>
                <View style={styles.headerText}>
                  <Text style={styles.invoiceNumber} numberOfLines={1}>{item.invoiceNumber}</Text>
                  <Text style={styles.restaurant} numberOfLines={1}>{item.restaurantName}</Text>
                </View>
              </View>
              <Badge label={item.orderStatusLabel} tone={item.orderStatusTone} />
            </View>

            <View style={styles.metaRow}>
              <MaterialIcons name="event" size={14} color={colors.textMuted} />
              <Text style={styles.meta}>{formatDateTime(item.issuedAt)}</Text>
            </View>
            {item.coupon ? (
              <View style={styles.metaRow}>
                <MaterialIcons name="local-offer" size={14} color={colors.textMuted} />
                <Text style={styles.meta}>Cupón: {item.coupon}</Text>
              </View>
            ) : null}

            <View style={styles.footer}>
              <Text style={styles.totalLabel}>Total facturado</Text>
              <Text style={styles.totalValue}>{formatCurrency(item.total)}</Text>
            </View>
          </Card>
        )}
      />
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: SPACING.lg, gap: SPACING.md },
  card: { gap: SPACING.xs },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, flex: 1, marginRight: SPACING.sm },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: { flex: 1 },
  invoiceNumber: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.semibold,
    fontWeight: '700',
    color: colors.text,
  },
  restaurant: {
    marginTop: 2,
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.body,
    color: colors.textMuted,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginTop: SPACING.xs },
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
  totalLabel: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.medium, color: colors.textSecondary },
  totalValue: { fontSize: FONT_SIZE.lg, fontFamily: FONTS.displayBold, fontWeight: '800', color: colors.primary },
});
