import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { FONTS, FONT_SIZE, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { useThemeStore } from '../hooks/useThemeStore';
import { IconCircle } from './IconCircle';

// Spinner centrado a pantalla completa.
export function LoadingSpinner({ message }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message ? <Text style={styles.muted}>{message}</Text> : null}
    </View>
  );
}

// Estado vacío para listas (icono en círculo tintado).
export function EmptyState({ icon = 'inbox', title = 'Sin datos', message, action }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  return (
    <View style={styles.empty}>
      <IconCircle icon={icon} size={64} style={styles.emptyIcon} />
      <Text style={styles.emptyTitle}>{title}</Text>
      {message ? <Text style={styles.muted}>{message}</Text> : null}
      {action ? <View style={styles.emptyAction}>{action}</View> : null}
    </View>
  );
}

// Tarjeta contenedora con sombra suave.
export function Card({ children, style }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  return <View style={[styles.card, style]}>{children}</View>;
}

// Píldora de estado con color semántico (fondo tintado + texto + borde).
export function Badge({ label, tone = 'info' }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const palette = getTones(colors)[tone] || getTones(colors).info;
  return (
    <View style={[styles.badge, { backgroundColor: palette.bg, borderColor: palette.border }]}>
      <Text style={[styles.badgeText, { color: palette.text }]}>{label}</Text>
    </View>
  );
}

// Fila de estrellas de calificación (1..5). Interactiva si se pasa onChange.
export function Rating({ value = 0, size = 18, onChange, showValue = false }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const rounded = Math.round(Number(value) || 0);
  return (
    <View style={styles.ratingRow}>
      {[1, 2, 3, 4, 5].map((star) => {
        const name = star <= rounded ? 'star' : 'star-border';
        const StarWrap = onChange ? TouchableOpacity : View;
        return (
          <StarWrap key={star} onPress={onChange ? () => onChange(star) : undefined} activeOpacity={0.7}>
            <MaterialIcons name={name} size={size} color={colors.star} />
          </StarWrap>
        );
      })}
      {showValue ? <Text style={styles.ratingValue}>{Number(value || 0).toFixed(1)}</Text> : null}
    </View>
  );
}

// Control de cantidad (– valor +) para carritos.
export function Stepper({ value = 1, min = 1, max = 99, onChange }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const dec = () => onChange?.(Math.max(min, value - 1));
  const inc = () => onChange?.(Math.min(max, value + 1));
  return (
    <View style={styles.stepper}>
      <TouchableOpacity onPress={dec} style={styles.stepBtn} activeOpacity={0.7} disabled={value <= min}>
        <MaterialIcons name="remove" size={18} color={value <= min ? colors.textMuted : colors.primary} />
      </TouchableOpacity>
      <Text style={styles.stepValue}>{value}</Text>
      <TouchableOpacity onPress={inc} style={styles.stepBtn} activeOpacity={0.7} disabled={value >= max}>
        <MaterialIcons name="add" size={18} color={value >= max ? colors.textMuted : colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const getTones = (colors) => ({
  success: { bg: colors.successBg, text: colors.success, border: colors.successBorder },
  danger: { bg: colors.dangerBg, text: colors.danger, border: colors.dangerBorder },
  warning: { bg: colors.warningBg, text: colors.warning, border: colors.warningBorder },
  info: { bg: colors.infoBg, text: colors.info, border: colors.infoBorder },
  neutral: { bg: colors.neutralBg, text: colors.neutral, border: colors.neutralBorder },
});

const createStyles = (colors) => StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    backgroundColor: colors.background,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
    gap: SPACING.sm,
  },
  emptyIcon: { marginBottom: SPACING.xs },
  emptyTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.displayBold,
    fontWeight: '700',
    color: colors.text,
  },
  emptyAction: { marginTop: SPACING.md, alignSelf: 'stretch' },
  muted: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: SPACING.lg,
    ...SHADOWS.card,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ratingValue: {
    marginLeft: SPACING.xs,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.semibold,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepBtn: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepValue: {
    minWidth: 24,
    textAlign: 'center',
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    fontWeight: '700',
    color: colors.text,
  },
});
