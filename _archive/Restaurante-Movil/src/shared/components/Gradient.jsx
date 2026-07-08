import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { GRADIENTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';

// Tarjeta con gradiente de marca (marrón → terracota) y sombra coloreada.
// Por defecto usa el degradado "feature"; pasar `colors` para variar.
export function GradientCard({
  children,
  colors = GRADIENTS.feature,
  start = GRADIENTS.start,
  end = GRADIENTS.endDiagonal,
  locations,
  style,
  contentStyle,
}) {
  return (
    <View style={[styles.shadow, style]}>
      <LinearGradient
        colors={colors}
        start={start}
        end={end}
        locations={locations}
        style={[styles.card, contentStyle]}
      >
        {children}
      </LinearGradient>
    </View>
  );
}

// Banda/fondo con el gradiente de marca (headers, hero). Hijos por encima.
export function BrandGradient({ children, style, start = GRADIENTS.start, end = GRADIENTS.endHorizontal }) {
  return (
    <LinearGradient
      colors={GRADIENTS.brand}
      locations={GRADIENTS.brandLocations}
      start={start}
      end={end}
      style={style}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  shadow: { borderRadius: RADIUS.lg, ...SHADOWS.brand },
  card: { borderRadius: RADIUS.lg, padding: SPACING.lg, overflow: 'hidden' },
});
