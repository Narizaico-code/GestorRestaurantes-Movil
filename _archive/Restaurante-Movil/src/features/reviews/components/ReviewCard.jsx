import { memo, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Card, Rating } from '../../../shared/components';
import { FONTS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { useAuthStore } from '../../../shared/store/authStore';
import { canEditReview, REVIEW_EDIT_WINDOW_MS } from '../hooks/useReviews';

// Tarjeta de una reseña individual (usuario + calificación + comentario).
// Si la reseña pertenece al usuario autenticado: `onDelete` siempre disponible;
// `onEdit` solo se muestra dentro de los primeros 3 minutos de creada la reseña
// (se oculta solo, con un timer, sin esperar a que se recargue la pantalla).
export const ReviewCard = memo(function ReviewCard({ review, onEdit, onDelete }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const currentUserId = useAuthStore((state) => state.user?.id);
  const isOwner = Boolean(review.userId) && String(review.userId) === String(currentUserId);
  const [editable, setEditable] = useState(() => isOwner && canEditReview(review));

  useEffect(() => {
    if (!isOwner || !canEditReview(review)) {
      setEditable(false);
      return;
    }
    setEditable(true);
    const elapsed = Date.now() - new Date(review.createdAt).getTime();
    const timer = setTimeout(() => setEditable(false), REVIEW_EDIT_WINDOW_MS - elapsed);
    return () => clearTimeout(timer);
  }, [isOwner, review]);

  return (
    <Card style={styles.card}>
      <View style={styles.top}>
        <Text style={styles.user}>{review.userName}</Text>
        <View style={styles.topRight}>
          <Rating value={review.rating} size={14} />
          {editable && onEdit ? (
            <TouchableOpacity onPress={() => onEdit(review)} hitSlop={8} style={styles.actionBtn}>
              <MaterialIcons name="edit" size={16} color={colors.primary} />
            </TouchableOpacity>
          ) : null}
          {isOwner && onDelete ? (
            <TouchableOpacity onPress={() => onDelete(review)} hitSlop={8} style={styles.actionBtn}>
              <MaterialIcons name="delete-outline" size={16} color={colors.danger} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      {review.comment ? <Text style={styles.comment}>{review.comment}</Text> : null}
    </Card>
  );
});

const createStyles = (colors) => StyleSheet.create({
  card: { gap: SPACING.xs },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  actionBtn: { padding: 2 },
  user: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.semibold, fontWeight: '700', color: colors.text },
  comment: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: colors.textSecondary, lineHeight: 20 },
});
