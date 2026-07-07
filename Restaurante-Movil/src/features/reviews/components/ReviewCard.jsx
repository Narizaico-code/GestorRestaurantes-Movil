import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card, Rating } from '../../../shared/components';
import { FONTS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';

// Tarjeta de una reseña individual (usuario + calificación + comentario).
export const ReviewCard = memo(function ReviewCard({ review }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  return (
    <Card style={styles.card}>
      <View style={styles.top}>
        <Text style={styles.user}>{review.userName}</Text>
        <Rating value={review.rating} size={14} />
      </View>
      {review.comment ? <Text style={styles.comment}>{review.comment}</Text> : null}
    </Card>
  );
});

const createStyles = (colors) => StyleSheet.create({
  card: { gap: SPACING.xs },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  user: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.semibold, fontWeight: '700', color: colors.text },
  comment: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: colors.textSecondary, lineHeight: 20 },
});
