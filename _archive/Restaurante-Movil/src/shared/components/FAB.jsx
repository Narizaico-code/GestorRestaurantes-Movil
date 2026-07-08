import { StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { useThemeStore } from '../hooks/useThemeStore';

// Botón flotante circular (bottom-right) para acciones rápidas de una pantalla,
// ej. "nueva reservación" o "nuevo pedido" desde el listado correspondiente.
export function FAB({ icon = 'add', onPress, style }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  return (
    <TouchableOpacity
      style={[styles.fab, style]}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
    >
      <MaterialIcons name={icon} size={26} color={colors.white} />
    </TouchableOpacity>
  );
}

const createStyles = (colors) => StyleSheet.create({
  fab: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: SPACING.lg,
    width: 56,
    height: 56,
    borderRadius: RADIUS.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.floating,
  },
});
