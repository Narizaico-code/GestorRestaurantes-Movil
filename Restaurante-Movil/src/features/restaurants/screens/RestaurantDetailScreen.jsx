import { useCallback } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { Button, LoadingSpinner, Rating } from '../../../shared/components';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { useCartStore } from '../../../shared/store/cartStore';
import { confirmAction, notify } from '../../../shared/utils/confirm';
import { formatCurrency } from '../../../shared/utils/format';
import { MenuSection } from '../../menus/components/MenuSection';
import { useMenus } from '../../menus/hooks/useMenus';
import { ReviewCard } from '../../reviews/components/ReviewCard';
import { ReviewFormModal } from '../../reviews/components/ReviewFormModal';
import { useReviewFormController } from '../../reviews/hooks/useReviewFormController';
import { useReviews } from '../../reviews/hooks/useReviews';
import { useRestaurant } from '../hooks/useRestaurants';

export function RestaurantDetailScreen({ navigation, route }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const insets = useSafeAreaInsets();
  const initial = route.params?.restaurant;
  const { restaurant } = useRestaurant(initial?.id, initial);
  const { sections, loading: menusLoading } = useMenus(restaurant?.id);
  const { reviews, average, count, createReview, updateReview, deleteReview } = useReviews({
    restaurantId: restaurant?.id,
  });
  const reviewForm = useReviewFormController({ createReview, updateReview });

  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);
  const cartRestaurantId = useCartStore((s) => s.restaurantId);

  const cartForThis = cartRestaurantId === restaurant?.id ? cartItems : [];
  const cartCount = cartForThis.reduce((sum, it) => sum + it.quantity, 0);
  const cartTotal = cartForThis.reduce((sum, it) => sum + it.price * it.quantity, 0);

  // useCallback: se pasa hacia abajo hasta cada MenuCard (memoizado), así que una
  // referencia estable evita que toda la carta se vuelva a renderizar sin necesidad.
  const onAdd = useCallback(
    (menu) => {
      addItem({ id: restaurant.id, name: restaurant.name }, menu, 1);
    },
    [addItem, restaurant]
  );

  const onDeleteReview = useCallback(
    (review) =>
      confirmAction({
        title: 'Eliminar reseña',
        message: '¿Seguro que deseas eliminar tu reseña?',
        confirmText: 'Eliminar',
        destructive: true,
        onConfirm: async () => {
          const result = await deleteReview(review.id);
          if (!result.ok) notify('Error', result.error);
        },
      }),
    [deleteReview]
  );

  const onPressMenu = useCallback(
    (menu) => navigation.navigate('MenuDetail', { menu, restaurant }),
    [navigation, restaurant]
  );

  const goReserve = () =>
    navigation.navigate('Reservas', { screen: 'NewReservation', params: { restaurant } });

  const goCart = () => navigation.navigate('Pedidos', { screen: 'Cart' });

  if (!restaurant) return <LoadingSpinner message="Cargando restaurante..." />;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: cartCount > 0 ? 96 : SPACING.xl }]}>
        {restaurant.image ? (
          <Image source={{ uri: restaurant.image }} style={styles.cover} />
        ) : (
          <View style={[styles.cover, styles.coverPlaceholder]}>
            <MaterialIcons name="restaurant" size={44} color={colors.primary} />
          </View>
        )}

        <View style={styles.headerBody}>
          <Text style={styles.name}>{restaurant.name}</Text>
          <View style={styles.ratingRow}>
            <Rating value={average} showValue={count > 0} />
            <Text style={styles.reviewCount}>{count > 0 ? `(${count} reseñas)` : 'Sin reseñas aún'}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="place" size={16} color={colors.textMuted} />
            <Text style={styles.infoText}>{restaurant.address || 'Dirección no disponible'}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="schedule" size={16} color={colors.textMuted} />
            <Text style={styles.infoText}>{restaurant.hoursLabel}</Text>
          </View>
          {restaurant.phone ? (
            <View style={styles.infoRow}>
              <MaterialIcons name="phone" size={16} color={colors.textMuted} />
              <Text style={styles.infoText}>{restaurant.phone}</Text>
            </View>
          ) : null}

          <Button title="Reservar mesa" gradient onPress={goReserve} style={styles.reserveBtn} />
        </View>

        {/* Carta */}
        <Text style={styles.sectionTitle}>Carta</Text>
        {menusLoading ? (
          <Text style={styles.muted}>Cargando carta...</Text>
        ) : sections.length === 0 ? (
          <Text style={styles.muted}>Este restaurante aún no publicó su carta.</Text>
        ) : (
          sections.map((section) => (
            <MenuSection key={section.category} section={section} onAddItem={onAdd} onPressItem={onPressMenu} />
          ))
        )}

        {/* Reseñas */}
        <View style={styles.reviewsHeader}>
          <Text style={styles.sectionTitle}>Reseñas</Text>
          <TouchableOpacity onPress={reviewForm.openCreate}>
            <Text style={styles.link}>Escribir reseña</Text>
          </TouchableOpacity>
        </View>
        {reviews.length === 0 ? (
          <Text style={styles.muted}>Sé el primero en dejar una reseña.</Text>
        ) : (
          reviews.slice(0, 5).map((review) => (
            <ReviewCard key={review.id} review={review} onEdit={reviewForm.openEdit} onDelete={onDeleteReview} />
          ))
        )}
      </ScrollView>

      {/* Barra flotante del carrito */}
      {cartCount > 0 ? (
        <TouchableOpacity
          style={[styles.cartBar, { paddingBottom: insets.bottom || SPACING.md }]}
          onPress={goCart}
          activeOpacity={0.9}
        >
          <View style={styles.cartBarInner}>
            <View style={styles.cartCountPill}>
              <Text style={styles.cartCountText}>{cartCount}</Text>
            </View>
            <Text style={styles.cartBarText}>Ver carrito</Text>
            <Text style={styles.cartBarTotal}>{formatCurrency(cartTotal)}</Text>
          </View>
        </TouchableOpacity>
      ) : null}

      <ReviewFormModal
        visible={reviewForm.visible}
        initialValues={reviewForm.initialValues}
        onClose={reviewForm.close}
        onSubmit={reviewForm.onSubmit}
      />
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: SPACING.lg, gap: SPACING.md },
  cover: { width: '100%', height: 200, borderRadius: RADIUS.lg, backgroundColor: colors.surfaceAlt },
  coverPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  headerBody: { gap: SPACING.xs },
  name: { fontSize: FONT_SIZE.xxl, fontFamily: FONTS.displayBold, fontWeight: '800', color: colors.text },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.xs },
  reviewCount: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.medium, color: colors.textMuted },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  infoText: { flex: 1, fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: colors.textSecondary },
  reserveBtn: { marginTop: SPACING.md },

  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.displayBold,
    fontWeight: '700',
    color: colors.text,
    marginTop: SPACING.sm,
  },

  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  link: { color: colors.primary, fontFamily: FONTS.bold, fontWeight: '700', fontSize: FONT_SIZE.sm },
  muted: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: colors.textMuted },

  cartBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  cartBarInner: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  cartCountPill: {
    minWidth: 28,
    height: 28,
    borderRadius: RADIUS.pill,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xs,
  },
  cartCountText: { color: colors.white, fontFamily: FONTS.bold, fontWeight: '800', fontSize: FONT_SIZE.sm },
  cartBarText: { flex: 1, color: colors.white, fontFamily: FONTS.bold, fontWeight: '700', fontSize: FONT_SIZE.md },
  cartBarTotal: { color: colors.white, fontFamily: FONTS.displayBold, fontWeight: '800', fontSize: FONT_SIZE.md },
});
