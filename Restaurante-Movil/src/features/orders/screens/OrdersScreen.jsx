import { useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { EmptyState, FAB, LoadingSpinner } from '../../../shared/components';
import { SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { useCartStore } from '../../../shared/store/cartStore';
import { OrderListItem } from '../components/OrderListItem';
import { useOrders } from '../hooks/useOrders';

export function OrdersScreen({ navigation }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const { orders, loading, error, refetch } = useOrders();
  const cartItemCount = useCartStore((s) => s.items.length);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // Si ya hay algo en el carrito, ir directo a confirmarlo; si no, elegir restaurante primero.
  const goNewOrder = () =>
    cartItemCount > 0
      ? navigation.navigate('Cart')
      : navigation.navigate('Restaurantes', { screen: 'RestaurantsList' });

  if (loading && orders.length === 0) {
    return <LoadingSpinner message="Cargando pedidos..." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={colors.primary} />}
        ListEmptyComponent={
          <EmptyState
            icon="receipt-long"
            title="Sin pedidos"
            message={error || 'Aún no has realizado pedidos. Explora un restaurante para empezar.'}
          />
        }
        renderItem={({ item }) => (
          <OrderListItem order={item} onPress={() => navigation.navigate('OrderDetail', { order: item })} />
        )}
      />
      <FAB icon={cartItemCount > 0 ? 'shopping-cart' : 'add'} onPress={goNewOrder} />
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: SPACING.lg, gap: SPACING.md },
});
