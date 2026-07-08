import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Button, Card, IconCircle } from '../../../shared/components';
import { FONTS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { confirmAction, notify } from '../../../shared/utils/confirm';
import { useAccount } from '../hooks/useAccount';

const CONSEQUENCES = [
  'Perderás acceso a tus reservaciones y pedidos.',
  'Tu perfil e información personal se eliminarán.',
  'Esta acción no se puede deshacer.',
];

export function DeleteAccountScreen() {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const { deleteAccount } = useAccount();
  const [submitting, setSubmitting] = useState(false);

  // Doble confirmación: primero el usuario navega aquí a propósito, luego debe
  // confirmar en el diálogo nativo. Adecuado para una acción destructiva e irreversible.
  const onDelete = () =>
    confirmAction({
      title: 'Eliminar cuenta',
      message: '¿Estás completamente seguro? Esta acción es permanente y no se puede deshacer.',
      confirmText: 'Eliminar mi cuenta',
      destructive: true,
      onConfirm: async () => {
        setSubmitting(true);
        const result = await deleteAccount();
        setSubmitting(false);
        if (!result.ok) {
          notify('Error', result.error);
          return;
        }
        // deleteAccount() ya cerró la sesión: AppNavigator vuelve a AuthStack solo.
      },
    });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <IconCircle icon="warning-amber" size={72} tone="danger" style={styles.iconCircle} />
      <Text style={styles.title}>Eliminar tu cuenta</Text>
      <Text style={styles.subtitle}>Antes de continuar, ten en cuenta que:</Text>

      <Card style={styles.card}>
        {CONSEQUENCES.map((text) => (
          <View key={text} style={styles.row}>
            <MaterialIcons name="close" size={16} color={colors.danger} />
            <Text style={styles.rowText}>{text}</Text>
          </View>
        ))}
      </Card>

      <Button title="Eliminar mi cuenta" variant="danger" onPress={onDelete} loading={submitting} />
    </ScrollView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: SPACING.xl },
  iconCircle: { alignSelf: 'center', marginBottom: SPACING.lg },
  title: { fontSize: FONT_SIZE.xxl, fontFamily: FONTS.displayBold, fontWeight: '800', color: colors.text, textAlign: 'center' },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  card: { gap: SPACING.sm, marginBottom: SPACING.xl },
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  rowText: { flex: 1, fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: colors.textSecondary },
});
