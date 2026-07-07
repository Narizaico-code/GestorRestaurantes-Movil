import { useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

import { Badge, Card, EmptyState, LoadingSpinner } from '../../../shared/components';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { formatCurrency, formatDateTime } from '../../../shared/utils/format';
import { useOrders } from '../hooks/useOrders';

export function OrdersScreen({ navigation }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const { orders, loading, error, refetch } = useOrders();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  if (loading && orders.length === 0) {
    return <LoadingSpinner message="Cargando pedidos..." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={colors.primary} />}
        ListEmptyComponent={
          <EmptyState
            icon="receipt-long"
            title="Sin pedidos"
            message={error || 'Aún no has realizado pedidos. Explora un restaurante para empezar.'}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('OrderDetail', { order: item })}>
            <Card style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.row}>
                  <View style={styles.iconCircle}>
                    <MaterialIcons name="receipt-long" size={20} color={colors.primary} />
                  </View>
                  <Text style={styles.restaurant} numberOfLines={1}>{item.restaurantName}</Text>
                </View>
                <Badge label={item.statusLabel} tone={item.statusTone} />
              </View>

              <View style={styles.metaRow}>
                <MaterialIcons name="lunch-dining" size={14} color={colors.textMuted} />
                <Text style={styles.meta}>{item.itemCount} artículo(s) · {item.orderTypeLabel}</Text>
              </View>
              <View style={styles.footer}>
                <Text style={styles.date}>{formatDateTime(item.createdAt)}</Text>
                <Text style={styles.total}>{formatCurrency(item.total)}</Text>
              </View>
            </Card>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: SPACING.lg, gap: SPACING.md },
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
