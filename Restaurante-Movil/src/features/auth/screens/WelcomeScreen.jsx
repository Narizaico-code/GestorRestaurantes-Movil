import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GRADIENTS, FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';

const HIGHLIGHTS = [
  { icon: 'restaurant-menu', text: 'Explora restaurantes y sus cartas' },
  { icon: 'event-seat', text: 'Reserva tu mesa en segundos' },
  { icon: 'delivery-dining', text: 'Pide a domicilio o para llevar' },
];

export function WelcomeScreen({ navigation }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={GRADIENTS.hero}
      start={GRADIENTS.start}
      end={GRADIENTS.endDiagonal}
      style={[styles.container, { paddingTop: insets.top + SPACING.xxl }]}
    >
      <View style={styles.top}>
        <View style={styles.brandBadge}>
          <MaterialIcons name="restaurant" size={38} color={colors.white} />
        </View>
        <Text style={styles.brand}>Sabor a la Carta</Text>
        <Text style={styles.tagline}>Tu mesa favorita, siempre a un toque de distancia.</Text>
      </View>

      <View style={styles.highlights}>
        {HIGHLIGHTS.map((item) => (
          <View key={item.text} style={styles.highlightRow}>
            <View style={styles.highlightIcon}>
              <MaterialIcons name={item.icon} size={20} color={colors.white} />
            </View>
            <Text style={styles.highlightText}>{item.text}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.actions, { paddingBottom: insets.bottom + SPACING.xl }]}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Login')} activeOpacity={0.9}>
          <Text style={styles.primaryButtonText}>Iniciar sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Register')} activeOpacity={0.9}>
          <Text style={styles.secondaryButtonText}>Crear cuenta</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, paddingHorizontal: SPACING.xl, justifyContent: 'space-between' },
  top: { alignItems: 'center', marginTop: SPACING.xxl },
  brandBadge: {
    width: 84,
    height: 84,
    borderRadius: RADIUS.pill,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  brand: { fontSize: FONT_SIZE.xxxl, fontFamily: FONTS.displayBold, color: colors.white, textAlign: 'center' },
  tagline: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.body,
    color: 'rgba(255,255,255,0.85)',
    marginTop: SPACING.sm,
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 22,
  },
  highlights: { gap: SPACING.md },
  highlightRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  highlightIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightText: { flex: 1, color: 'rgba(255,255,255,0.92)', fontFamily: FONTS.medium, fontSize: FONT_SIZE.md },
  actions: { gap: SPACING.md },
  primaryButton: {
    backgroundColor: colors.white,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  primaryButtonText: { color: colors.primaryDark, fontSize: FONT_SIZE.lg, fontFamily: FONTS.bold, fontWeight: '700' },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  secondaryButtonText: { color: colors.white, fontSize: FONT_SIZE.lg, fontFamily: FONTS.bold, fontWeight: '700' },
});
