import { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Button, Input, Rating } from '../../../shared/components';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';

// Modal para escribir una reseña (rating + comentario + nombre visible).
// Sólo maneja el formulario; la llamada a la API vive en el hook del padre.
export function ReviewFormModal({ visible, onClose, onSubmit }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    await onSubmit({ rating, comment: comment.trim(), userName: userName.trim() || 'Anónimo' });
    setSubmitting(false);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Escribir reseña</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Tu calificación</Text>
          <View style={styles.ratingRow}>
            <Rating value={rating} size={34} onChange={setRating} />
          </View>

          <Input
            label="Nombre (opcional)"
            leftIcon="person-outline"
            placeholder="Cómo aparecerás"
            value={userName}
            onChangeText={setUserName}
          />
          <Input
            label="Comentario"
            placeholder="Cuéntanos tu experiencia"
            value={comment}
            onChangeText={setComment}
            multiline
          />

          <Button title="Publicar reseña" gradient onPress={submit} loading={submitting} />
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (colors) => StyleSheet.create({
  overlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  card: {
    backgroundColor: colors.background,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xl,
    gap: SPACING.xs,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  title: { fontSize: FONT_SIZE.xl, fontFamily: FONTS.displayBold, fontWeight: '800', color: colors.text },
  label: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.semibold, fontWeight: '600', color: colors.textSecondary },
  ratingRow: { alignItems: 'center', marginVertical: SPACING.md },
});
