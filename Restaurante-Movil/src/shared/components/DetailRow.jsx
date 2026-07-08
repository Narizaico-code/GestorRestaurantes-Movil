import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { FONTS, FONT_SIZE, SPACING } from '../constants/theme';
import { useThemeStore } from '../hooks/useThemeStore';

// Fila icono + etiqueta + valor, usada en pantallas de detalle (reservación, pedido, etc.).
export function DetailRow({ icon, label, value, last = false }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <View style={styles.left}>
        <MaterialIcons name={icon} size={18} color={colors.primary} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowLast: { borderBottomWidth: 0 },
  left: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  label: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: colors.textSecondary },
  value: { flex: 1, textAlign: 'right', fontSize: FONT_SIZE.sm, fontFamily: FONTS.semibold, fontWeight: '700', color: colors.text },
});
