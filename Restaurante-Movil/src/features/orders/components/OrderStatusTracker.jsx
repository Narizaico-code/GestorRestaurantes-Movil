import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { getActiveStepIndex, isOrderCancelled, ORDER_STATUS_STEPS } from '../utils/orderStatusFlow';

// Línea de tiempo visual del estado del pedido (seguimiento). Si el pedido está
// cancelado se muestra un aviso en lugar de la progresión normal.
export function OrderStatusTracker({ status }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  if (isOrderCancelled(status)) {
    return (
      <View style={styles.cancelledBanner}>
        <MaterialIcons name="cancel" size={20} color={colors.danger} />
        <Text style={styles.cancelledText}>Este pedido fue cancelado</Text>
      </View>
    );
  }

  const activeIndex = getActiveStepIndex(status);

  return (
    <View style={styles.row}>
      {ORDER_STATUS_STEPS.map((step, index) => {
        const reached = index <= activeIndex;
        const isLast = index === ORDER_STATUS_STEPS.length - 1;
        return (
          <View key={step.value} style={styles.stepWrap}>
            <View style={styles.stepCol}>
              <View style={[styles.circle, reached && styles.circleActive]}>
                <MaterialIcons name={step.icon} size={16} color={reached ? colors.white : colors.textMuted} />
              </View>
              <Text style={[styles.stepLabel, reached && styles.stepLabelActive]} numberOfLines={2}>
                {step.label}
              </Text>
            </View>
            {!isLast ? <View style={[styles.connector, index < activeIndex && styles.connectorActive]} /> : null}
          </View>
        );
      })}
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: SPACING.sm },
  stepWrap: { flexDirection: 'row', alignItems: 'flex-start', flex: 1 },
  stepCol: { alignItems: 'center', width: 76 },
  circle: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.pill,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  stepLabel: {
    marginTop: SPACING.xs,
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: colors.textMuted,
    textAlign: 'center',
  },
  stepLabelActive: { color: colors.text, fontFamily: FONTS.semibold, fontWeight: '700' },
  connector: {
    flex: 1,
    height: 2,
    backgroundColor: colors.border,
    marginTop: 15,
    marginHorizontal: -SPACING.sm,
  },
  connectorActive: { backgroundColor: colors.primary },
  cancelledBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: colors.dangerBg,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    padding: SPACING.md,
  },
  cancelledText: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.semibold, fontWeight: '700', color: colors.danger },
});
