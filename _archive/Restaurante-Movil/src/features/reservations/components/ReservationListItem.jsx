import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Badge, Card } from '../../../shared/components';
import { RESERVATION_TYPE_LABELS } from '../../../shared/constants';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { formatDate, formatTime } from '../../../shared/utils/format';

// Tarjeta de una reservación en el listado "Mis Reservaciones".
export function ReservationListItem({ reservation, onPress }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.row}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="event-seat" size={20} color={colors.primary} />
            </View>
            <Text style={styles.restaurant} numberOfLines={1}>{reservation.restaurantName}</Text>
          </View>
          <Badge label={reservation.statusLabel} tone={reservation.statusTone} />
        </View>

        <View style={styles.metaRow}>
          <MaterialIcons name="calendar-today" size={14} color={colors.textMuted} />
          <Text style={styles.meta}>{formatDate(reservation.startDate)} · {formatTime(reservation.startDate)}</Text>
        </View>
        <View style={styles.metaRow}>
          <MaterialIcons name="group" size={14} color={colors.textMuted} />
          <Text style={styles.meta}>
            {reservation.numberPeople} persona(s) · {RESERVATION_TYPE_LABELS[reservation.type] || reservation.type}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const createStyles = (colors) => StyleSheet.create({
  card: { gap: SPACING.xs },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, flex: 1, marginRight: SPACING.sm },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restaurant: { flex: 1, fontSize: FONT_SIZE.md, fontFamily: FONTS.semibold, fontWeight: '700', color: colors.text },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: SPACING.xs },
  meta: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: colors.textSecondary },
});
