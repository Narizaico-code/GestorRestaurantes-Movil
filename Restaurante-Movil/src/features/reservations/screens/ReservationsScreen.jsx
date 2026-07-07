import { useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

import { Badge, Card, EmptyState, LoadingSpinner } from '../../../shared/components';
import { RESERVATION_TYPE_LABELS } from '../../../shared/constants';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { formatDate, formatTime } from '../../../shared/utils/format';
import { useReservations } from '../hooks/useReservations';

export function ReservationsScreen({ navigation }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const { reservations, loading, error, refetch } = useReservations();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  if (loading && reservations.length === 0) {
    return <LoadingSpinner message="Cargando reservaciones..." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={reservations}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={colors.primary} />}
        ListEmptyComponent={
          <EmptyState
            icon="event-seat"
            title="Sin reservaciones"
            message={error || 'Aún no tienes reservaciones. Elige un restaurante para reservar tu mesa.'}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('ReservationDetail', { reservation: item })}>
            <Card style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.row}>
                  <View style={styles.iconCircle}>
                    <MaterialIcons name="event-seat" size={20} color={colors.primary} />
                  </View>
                  <Text style={styles.restaurant} numberOfLines={1}>{item.restaurantName}</Text>
                </View>
                <Badge label={item.statusLabel} tone={item.statusTone} />
              </View>

              <View style={styles.metaRow}>
                <MaterialIcons name="calendar-today" size={14} color={colors.textMuted} />
                <Text style={styles.meta}>{formatDate(item.startDate)} · {formatTime(item.startDate)}</Text>
              </View>
              <View style={styles.metaRow}>
                <MaterialIcons name="group" size={14} color={colors.textMuted} />
                <Text style={styles.meta}>
                  {item.numberPeople} persona(s) · {RESERVATION_TYPE_LABELS[item.type] || item.type}
                </Text>
              </View>
            </Card>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: SPACING.lg, gap: SPACING.md },
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
