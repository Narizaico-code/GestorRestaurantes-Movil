import { useCallback } from 'react';
import { Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

import { Card, GradientCard, LoadingSpinner } from '../../../shared/components';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { useAuthStore } from '../../../shared/store/authStore';
import { useRestaurants } from '../../restaurants/hooks/useRestaurants';
import { usePromotions } from '../../promotions/hooks/usePromotions';

const QUICK_ACTIONS = [
  { icon: 'storefront', label: 'Restaurantes', tab: 'Restaurantes', screen: 'RestaurantsList' },
  { icon: 'event-seat', label: 'Reservas', tab: 'Reservas', screen: 'MyReservations' },
  { icon: 'receipt-long', label: 'Pedidos', tab: 'Pedidos', screen: 'MyOrders' },
  { icon: 'local-offer', label: 'Promos', tab: 'Perfil', screen: 'Promotions' },
];

export function HomeScreen({ navigation }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const user = useAuthStore((state) => state.user);
  const { restaurants, loading, refetch } = useRestaurants();
  const { promotions, refetch: refetchPromos } = usePromotions();

  useFocusEffect(
    useCallback(() => {
      refetch();
      refetchPromos();
    }, [refetch, refetchPromos])
  );

  const openRestaurant = (restaurant) =>
    navigation.navigate('Restaurantes', { screen: 'RestaurantDetail', params: { restaurant } });

  if (loading && restaurants.length === 0) {
    return <LoadingSpinner message="Cargando tu experiencia..." />;
  }

  const featured = restaurants.slice(0, 6);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={colors.primary} />}
    >
      <Text style={styles.greeting}>Hola, {user?.name?.split(' ')[0] || 'invitado'} 👋</Text>
      <Text style={styles.subGreeting}>¿Qué se te antoja hoy?</Text>

      <GradientCard contentStyle={styles.heroInner}>
        <View style={styles.heroTop}>
          <Text style={styles.heroLabel}>Descubre</Text>
          <View style={styles.heroChip}>
            <MaterialIcons name="restaurant-menu" size={16} color={colors.white} />
          </View>
        </View>
        <Text style={styles.heroMain}>{restaurants.length} restaurantes</Text>
        <Text style={styles.heroSub}>listos para reservar o pedir a domicilio</Text>
      </GradientCard>

      <View style={styles.actionsRow}>
        {QUICK_ACTIONS.map((action) => (
          <TouchableOpacity
            key={action.label}
            style={styles.action}
            activeOpacity={0.85}
            onPress={() => navigation.navigate(action.tab, { screen: action.screen })}
          >
            <View style={styles.actionIcon}>
              <MaterialIcons name={action.icon} size={24} color={colors.primary} />
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {promotions.length > 0 ? (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Promociones activas</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Perfil', { screen: 'Promotions' })}>
              <Text style={styles.link}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promoRow}>
            {promotions.slice(0, 5).map((promo) => (
              <View key={promo.id} style={styles.promoCard}>
                <View style={styles.promoBadge}>
                  <MaterialIcons name="local-offer" size={16} color={colors.primary} />
                  <Text style={styles.promoDiscount}>{promo.discount}%</Text>
                </View>
                <Text style={styles.promoTitle} numberOfLines={2}>{promo.title}</Text>
                {promo.couponCode ? <Text style={styles.promoCoupon}>Cupón: {promo.couponCode}</Text> : null}
              </View>
            ))}
          </ScrollView>
        </>
      ) : null}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Restaurantes destacados</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Restaurantes', { screen: 'RestaurantsList' })}>
          <Text style={styles.link}>Ver todos</Text>
        </TouchableOpacity>
      </View>

      {featured.map((restaurant) => (
        <TouchableOpacity key={restaurant.id} activeOpacity={0.85} onPress={() => openRestaurant(restaurant)}>
          <Card style={styles.restaurantRow}>
            {restaurant.image ? (
              <Image source={{ uri: restaurant.image }} style={styles.restaurantThumb} />
            ) : (
              <View style={[styles.restaurantThumb, styles.thumbPlaceholder]}>
                <MaterialIcons name="restaurant" size={22} color={colors.primary} />
              </View>
            )}
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName} numberOfLines={1}>{restaurant.name}</Text>
              <Text style={styles.muted} numberOfLines={1}>{restaurant.address || 'Dirección no disponible'}</Text>
              <View style={styles.restaurantMeta}>
                <MaterialIcons name="schedule" size={13} color={colors.textMuted} />
                <Text style={styles.metaText}>{restaurant.hoursLabel}</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={colors.textMuted} />
          </Card>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: SPACING.lg, gap: SPACING.md },
  greeting: { fontSize: FONT_SIZE.xxl, fontFamily: FONTS.displayBold, fontWeight: '800', color: colors.text },
  subGreeting: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: colors.textSecondary, marginTop: -SPACING.xs },

  heroInner: { gap: SPACING.xs },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroLabel: { color: 'rgba(255,255,255,0.85)', fontFamily: FONTS.medium, fontSize: FONT_SIZE.sm, letterSpacing: 0.5 },
  heroChip: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.pill,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroMain: { color: colors.white, fontSize: FONT_SIZE.xxxl, fontFamily: FONTS.displayBold, fontWeight: '800' },
  heroSub: { color: 'rgba(255,255,255,0.85)', fontFamily: FONTS.body, fontSize: FONT_SIZE.xs, marginTop: SPACING.xs },

  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: SPACING.sm },
  action: { alignItems: 'center', gap: SPACING.xs, flex: 1 },
  actionIcon: {
    width: 58,
    height: 58,
    borderRadius: RADIUS.lg,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: { fontSize: FONT_SIZE.xs, color: colors.textSecondary, fontFamily: FONTS.semibold, fontWeight: '600' },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  sectionTitle: { fontSize: FONT_SIZE.lg, fontFamily: FONTS.displayBold, fontWeight: '700', color: colors.text },
  link: { color: colors.primary, fontFamily: FONTS.bold, fontWeight: '700', fontSize: FONT_SIZE.sm },

  promoRow: { gap: SPACING.md, paddingRight: SPACING.sm, paddingVertical: SPACING.xs },
  promoCard: {
    width: 180,
    backgroundColor: colors.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  promoBadge: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  promoDiscount: { fontFamily: FONTS.displayBold, fontWeight: '800', color: colors.primary, fontSize: FONT_SIZE.lg },
  promoTitle: { fontFamily: FONTS.semibold, fontWeight: '700', color: colors.text, fontSize: FONT_SIZE.sm },
  promoCoupon: { fontFamily: FONTS.medium, color: colors.textMuted, fontSize: FONT_SIZE.xs },

  restaurantRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  restaurantThumb: { width: 56, height: 56, borderRadius: RADIUS.md, backgroundColor: colors.surfaceAlt },
  thumbPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  restaurantInfo: { flex: 1, gap: 2 },
  restaurantName: { fontSize: FONT_SIZE.md, fontFamily: FONTS.semibold, fontWeight: '700', color: colors.text },
  restaurantMeta: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginTop: 2 },
  metaText: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.medium, color: colors.textMuted },
  muted: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: colors.textMuted },
});
