import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { PASSWORD_RULES } from '../utils/validators';
import { FONTS, FONT_SIZE, SPACING } from '../constants/theme';
import { useThemeStore } from '../hooks/useThemeStore';

// Checklist en vivo de los requisitos de contraseña. Reutilizable en cualquier
// formulario que cree o cambie una contraseña (Registro, Cambiar contraseña).
export function PasswordRulesChecklist({ password = '' }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      {PASSWORD_RULES.map((rule) => {
        const met = rule.test(password);
        return (
          <View key={rule.id} style={styles.row}>
            <MaterialIcons
              name={met ? 'check-circle' : 'radio-button-unchecked'}
              size={14}
              color={met ? colors.success : colors.textMuted}
            />
            <Text style={[styles.label, met && styles.labelMet]}>{rule.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { gap: 4, marginTop: -SPACING.sm, marginBottom: SPACING.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  label: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.body, color: colors.textMuted },
  labelMet: { color: colors.success, fontFamily: FONTS.medium },
});
