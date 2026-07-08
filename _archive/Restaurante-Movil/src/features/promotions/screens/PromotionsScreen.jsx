import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Card, EmptyState, LoadingSpinner } from '../../../shared/components';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { formatDate } from '../../../shared/utils/format';
import { usePromotions } from '../hooks/usePromotions';

export function PromotionsScreen() {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const { promotions, loading, error, refetch } = usePromotions();

  if (loading && promotions.length === 0) {
    return <LoadingSpinner message="Cargando promociones..." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={promotions}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={colors.primary} />}
        ListEmptyComponent={
          <EmptyState
            icon="local-offer"
            title="Sin promociones"
            message={error || 'No hay promociones activas en este momento. Vuelve pronto.'}
          />
        }
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.header}>
              <View style={styles.discountPill}>
                <Text style={styles.discountText}>{item.discount}%</Text>
                <Text style={styles.discountLabel}>OFF</Text>
              </View>
              <View style={styles.headerInfo}>
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                {item.restaurantName ? <Text style={styles.restaurant}>{item.restaurantName}</Text> : null}
              </View>
            </View>

            {item.description ? <Text style={styles.description}>{item.description}</Text> : null}

            <View style={styles.footer}>
              {item.couponCode ? (
                <View style={styles.coupon}>
                  <MaterialIcons name="confirmation-number" size={14} color={colors.primary} />
                  <Text style={styles.couponText}>{item.couponCode}</Text>
                </View>
              ) : (
                <View />
              )}
              {item.endDate ? <Text style={styles.validity}>Hasta {formatDate(item.endDate)}</Text> : null}
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
  card: { gap: SPACING.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  discountPill: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discountText: { fontSize: FONT_SIZE.xl, fontFamily: FONTS.displayBold, fontWeight: '800', color: colors.primary },
  discountLabel: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.bold, fontWeight: '700', color: colors.primary, marginTop: -4 },
  headerInfo: { flex: 1, gap: 2 },
  title: { fontSize: FONT_SIZE.lg, fontFamily: FONTS.displayBold, fontWeight: '700', color: colors.text },
  restaurant: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.medium, color: colors.textSecondary },
  description: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: colors.textSecondary, lineHeight: 20 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  coupon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: colors.surfaceAlt,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  couponText: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.bold, fontWeight: '800', color: colors.primary, letterSpacing: 0.5 },
  validity: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.medium, color: colors.textMuted },
});
