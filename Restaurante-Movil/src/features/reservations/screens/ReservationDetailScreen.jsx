import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Badge, Button, Card, DetailRow } from '../../../shared/components';
import { RESERVATION_STATUS, RESERVATION_TYPE_LABELS } from '../../../shared/constants';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { confirmAction, notify } from '../../../shared/utils/confirm';
import { formatDate, formatTime } from '../../../shared/utils/format';
import { useReservations } from '../hooks/useReservations';

export function ReservationDetailScreen({ navigation, route }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const reservation = route.params?.reservation;
  const { cancelReservation } = useReservations();
  const [cancelling, setCancelling] = useState(false);

  if (!reservation) return null;

  const canCancel = reservation.status === RESERVATION_STATUS.PENDIENTE;
  const hasCoupon = Boolean(reservation.coupon);

  const onCancel = () =>
    confirmAction({
      title: 'Cancelar reservación',
      message: '¿Seguro que deseas cancelar esta reservación?',
      confirmText: 'Cancelar reservación',
      destructive: true,
      onConfirm: async () => {
        setCancelling(true);
        const result = await cancelReservation(reservation.id);
        setCancelling(false);
        if (!result.ok) {
          notify('Error', result.error);
          return;
        }
        notify('Reservación cancelada', 'Tu reservación fue cancelada.', () => navigation.goBack());
      },
    });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{reservation.restaurantName}</Text>
        <Badge label={reservation.statusLabel} tone={reservation.statusTone} />
      </View>

      {reservation.photo ? <Image source={{ uri: reservation.photo }} style={styles.photo} /> : null}

      <Card style={styles.card}>
        <DetailRow icon="calendar-today" label="Fecha" value={formatDate(reservation.startDate)} />
        <DetailRow
          icon="schedule"
          label="Horario"
          value={`${formatTime(reservation.startDate)} - ${formatTime(reservation.endDate)}`}
        />
        <DetailRow icon="group" label="Personas" value={String(reservation.numberPeople)} />
        <DetailRow
          icon="event-note"
          label="Tipo"
          value={RESERVATION_TYPE_LABELS[reservation.type] || reservation.type}
        />
        <DetailRow
          icon="table-restaurant"
          label="Mesas"
          value={reservation.tables.length ? reservation.tables.join(', ') : `${reservation.tableCount} mesa(s)`}
          last={!hasCoupon}
        />
        {hasCoupon ? <DetailRow icon="local-offer" label="Cupón" value={reservation.coupon} last /> : null}
      </Card>

      {reservation.description ? (
        <Card>
          <Text style={styles.descLabel}>Descripción</Text>
          <Text style={styles.descText}>{reservation.description}</Text>
        </Card>
      ) : null}

      {canCancel ? (
        <Button title="Cancelar reservación" variant="danger" onPress={onCancel} loading={cancelling} />
      ) : null}
    </ScrollView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: SPACING.lg, gap: SPACING.md },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: SPACING.md },
  title: { flex: 1, fontSize: FONT_SIZE.xl, fontFamily: FONTS.displayBold, fontWeight: '800', color: colors.text },
  photo: { width: '100%', height: 180, borderRadius: RADIUS.lg, backgroundColor: colors.surfaceAlt },
  card: { gap: 0 },
  descLabel: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.semibold, fontWeight: '700', color: colors.textSecondary, marginBottom: SPACING.xs },
  descText: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: colors.text, lineHeight: 20 },
});
