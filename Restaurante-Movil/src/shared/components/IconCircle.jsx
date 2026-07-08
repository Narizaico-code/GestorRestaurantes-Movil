import { StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useThemeStore } from '../hooks/useThemeStore';

const TONE_COLORS = {
  primary: (colors) => ({ bg: colors.primaryLight, icon: colors.primary }),
  danger: (colors) => ({ bg: colors.dangerBg, icon: colors.danger }),
};

// Círculo con icono centrado, tintado según `tone`. Centraliza el patrón de
// "icono en círculo de color" que aparecía repetido en varias pantallas
// (verificación de correo, recuperar contraseña, eliminar cuenta, menú de perfil,
// estado vacío, error boundary...).
export function IconCircle({ icon, size = 64, iconSize, tone = 'primary', style }) {
  const { colors } = useThemeStore();
  const palette = (TONE_COLORS[tone] || TONE_COLORS.primary)(colors);

  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: palette.bg },
        style,
      ]}
    >
      <MaterialIcons name={icon} size={iconSize ?? Math.round(size * 0.42)} color={palette.icon} />
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { alignItems: 'center', justifyContent: 'center' },
});
