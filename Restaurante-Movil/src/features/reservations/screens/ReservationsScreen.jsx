import { useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { EmptyState, FAB, LoadingSpinner } from '../../../shared/components';
import { SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { ReservationListItem } from '../components/ReservationListItem';
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

  const goPickRestaurant = () => navigation.navigate('Restaurantes', { screen: 'RestaurantsList' });

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
          <ReservationListItem
            reservation={item}
            onPress={() => navigation.navigate('ReservationDetail', { reservation: item })}
          />
        )}
      />
      <FAB onPress={goPickRestaurant} />
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: SPACING.lg, gap: SPACING.md },
});
