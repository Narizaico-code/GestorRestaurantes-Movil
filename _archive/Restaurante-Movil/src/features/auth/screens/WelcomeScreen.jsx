import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '../../../shared/components';
import { GRADIENTS, FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { WelcomeFeature } from '../components/WelcomeFeature';

const FEATURES = [
  { icon: 'restaurant-menu', title: 'Explora restaurantes', description: 'Descubre cartas y menús cerca de ti.' },
  { icon: 'event-seat', title: 'Reserva tu mesa', description: 'Aparta tu lugar en segundos.' },
  { icon: 'delivery-dining', title: 'Pide a domicilio', description: 'A domicilio o para llevar, tú eliges.' },
];

export function WelcomeScreen({ navigation }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* Hero de marca */}
      <LinearGradient
        colors={GRADIENTS.hero}
        start={GRADIENTS.start}
        end={GRADIENTS.endDiagonal}
        style={[styles.hero, { paddingTop: insets.top + SPACING.xxl }]}
      >
        <View style={styles.brandBadge}>
          <MaterialIcons name="restaurant" size={40} color={colors.white} />
        </View>
        <Text style={styles.brand}>Sabor a la Carta</Text>
        <Text style={styles.tagline}>Tu mesa favorita, siempre a un toque de distancia.</Text>
      </LinearGradient>

      {/* Panel de bienvenida */}
      <View style={[styles.sheet, { paddingBottom: insets.bottom + SPACING.xl }]}>
        <Text style={styles.sheetTitle}>Bienvenido 👋</Text>
        <Text style={styles.sheetSubtitle}>Todo lo que necesitas para comer bien, en un solo lugar.</Text>

        <View style={styles.features}>
          {FEATURES.map((feature) => (
            <WelcomeFeature key={feature.title} {...feature} />
          ))}
        </View>

        <View style={styles.actions}>
          <Button title="Iniciar sesión" gradient onPress={() => navigation.navigate('Login')} />
          <Button title="Crear cuenta" variant="secondary" onPress={() => navigation.navigate('Register')} />
        </View>
      </View>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  hero: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxxl,
    alignItems: 'center',
  },
  brandBadge: {
    width: 88,
    height: 88,
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
  sheet: {
    flex: 1,
    marginTop: -SPACING.xl,
    backgroundColor: colors.background,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    justifyContent: 'space-between',
  },
  sheetTitle: { fontSize: FONT_SIZE.xxl, fontFamily: FONTS.displayBold, fontWeight: '800', color: colors.text },
  sheetSubtitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.body,
    color: colors.textSecondary,
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  features: { gap: SPACING.lg },
  actions: { gap: SPACING.md, marginTop: SPACING.xl },
});
