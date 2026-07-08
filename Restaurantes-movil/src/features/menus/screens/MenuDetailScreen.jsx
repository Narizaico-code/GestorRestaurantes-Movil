import { useCallback } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Badge, Button, Rating } from '../../../shared/components';
import { MENU_CATEGORY_LABELS } from '../../../shared/constants';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { useCartStore } from '../../../shared/store/cartStore';
import { confirmAction, notify } from '../../../shared/utils/confirm';
import { formatCurrency } from '../../../shared/utils/format';
import { ReviewCard } from '../../reviews/components/ReviewCard';
import { ReviewFormModal } from '../../reviews/components/ReviewFormModal';
import { useReviewFormController } from '../../reviews/hooks/useReviewFormController';
import { useReviews } from '../../reviews/hooks/useReviews';

// Detalle de un platillo: info completa + calificación propia del platillo
// (distinta de la calificación del restaurante) + gestión de tus reseñas.
export function MenuDetailScreen({ route }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const menu = route.params?.menu;
  const restaurant = route.params?.restaurant;
  const { reviews, average, count, createReview, updateReview, deleteReview } = useReviews({ menuId: menu?.id });
  const reviewForm = useReviewFormController({ createReview, updateReview });
  const addItem = useCartStore((s) => s.addItem);

  const onAdd = () => {
    addItem({ id: restaurant.id, name: restaurant.name }, menu, 1);
    notify('Agregado', `${menu.name} se agregó a tu carrito.`);
  };

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

  if (!menu) return null;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {menu.image ? (
          <Image source={{ uri: menu.image }} style={styles.cover} />
        ) : (
          <View style={[styles.cover, styles.coverPlaceholder]}>
            <MaterialIcons name="restaurant-menu" size={44} color={colors.primary} />
          </View>
        )}

        <View style={styles.headerBody}>
          <View style={styles.headerRow}>
            <Text style={styles.name}>{menu.name}</Text>
            {!menu.isAvailable ? <Badge label="Agotado" tone="danger" /> : null}
          </View>
          <Text style={styles.categoryLabel}>{MENU_CATEGORY_LABELS[menu.category] || menu.category}</Text>

          <View style={styles.ratingRow}>
            <Rating value={average} showValue={count > 0} />
            <Text style={styles.reviewCount}>{count > 0 ? `(${count} reseñas)` : 'Sin reseñas aún'}</Text>
          </View>

          {menu.description ? <Text style={styles.description}>{menu.description}</Text> : null}

          <Text style={styles.price}>{formatCurrency(menu.price)}</Text>

          <Button
            title={menu.isAvailable ? 'Agregar al carrito' : 'No disponible'}
            gradient
            disabled={!menu.isAvailable}
            onPress={onAdd}
            style={styles.addBtn}
          />
        </View>

        <View style={styles.reviewsHeader}>
          <Text style={styles.sectionTitle}>Reseñas de este platillo</Text>
          <TouchableOpacity onPress={reviewForm.openCreate}>
            <Text style={styles.link}>Escribir reseña</Text>
          </TouchableOpacity>
        </View>
        {reviews.length === 0 ? (
          <Text style={styles.muted}>Sé el primero en calificar este platillo.</Text>
        ) : (
          reviews.map((review) => (
            <ReviewCard key={review.id} review={review} onEdit={reviewForm.openEdit} onDelete={onDeleteReview} />
          ))
        )}
      </ScrollView>

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
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: SPACING.sm },
  name: { flex: 1, fontSize: FONT_SIZE.xxl, fontFamily: FONTS.displayBold, fontWeight: '800', color: colors.text },
  categoryLabel: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.semibold, fontWeight: '600', color: colors.primary },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: SPACING.xs },
  reviewCount: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.medium, color: colors.textMuted },
  description: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.body,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: SPACING.sm,
  },
  price: { fontSize: FONT_SIZE.xl, fontFamily: FONTS.displayBold, fontWeight: '800', color: colors.primary, marginTop: SPACING.sm },
  addBtn: { marginTop: SPACING.md },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.displayBold,
    fontWeight: '700',
    color: colors.text,
    marginTop: SPACING.sm,
  },
  reviewsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.sm },
  link: { color: colors.primary, fontFamily: FONTS.bold, fontWeight: '700', fontSize: FONT_SIZE.sm },
  muted: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: colors.textMuted },
});
