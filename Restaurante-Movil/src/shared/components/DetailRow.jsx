import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { FONTS, FONT_SIZE, SPACING } from '../constants/theme';
import { useThemeStore } from '../hooks/useThemeStore';

// Fila "etiqueta: valor" reutilizable para pantallas de detalle (pedido,
// reservación, perfil, resumen de carrito). `icon` es opcional; `last` quita el
// separador inferior; `bordered=false` lo quita siempre (ej. resumen de carrito,
// que ya usa un divisor manual solo antes del total); `strong` agranda la
// tipografía (ej. fila de total).
export function DetailRow({ icon, label, value, last, strong, bordered = true }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  return (
    <View style={[styles.row, (!bordered || last) && styles.rowNoBorder]}>
      <View style={styles.left}>
        {icon ? <MaterialIcons name={icon} size={18} color={colors.primary} /> : null}
        <Text style={[styles.label, strong && styles.strong]}>{label}</Text>
      </View>
      <Text style={[styles.value, strong && styles.strong]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowNoBorder: { borderBottomWidth: 0 },
  left: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, flexShrink: 1 },
  label: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: colors.textSecondary },
  value: {
    flex: 1,
    textAlign: 'right',
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.semibold,
    fontWeight: '700',
    color: colors.text,
    marginLeft: SPACING.sm,
  },
  strong: { fontSize: FONT_SIZE.lg, fontFamily: FONTS.displayBold, fontWeight: '800', color: colors.text },
});
