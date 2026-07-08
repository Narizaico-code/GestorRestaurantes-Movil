import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';

// Fila de característica dentro del panel de bienvenida: icono tintado + título + detalle.
export function WelcomeFeature({ icon, title, description }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  return (
    <View style={styles.row}>
      <View style={styles.iconWrap}>
        <MaterialIcons name={icon} size={22} color={colors.primary} />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: RADIUS.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: { flex: 1 },
  title: { fontSize: FONT_SIZE.md, fontFamily: FONTS.semibold, fontWeight: '700', color: colors.text },
  description: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: colors.textSecondary, marginTop: 2 },
});
