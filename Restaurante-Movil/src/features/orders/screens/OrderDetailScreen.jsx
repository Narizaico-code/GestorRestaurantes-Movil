import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Badge, Button, Card } from '../../../shared/components';
import { FONTS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { confirmAction, notify } from '../../../shared/utils/confirm';
import { formatDateTime } from '../../../shared/utils/format';
import { OrderInfoCard } from '../components/OrderInfoCard';
import { OrderItemsList } from '../components/OrderItemsList';
import { OrderStatusTracker } from '../components/OrderStatusTracker';
import { useOrders } from '../hooks/useOrders';
import { isOrderCancellable } from '../utils/orderStatusFlow';

export function OrderDetailScreen({ navigation, route }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const order = route.params?.order;
  const { cancelOrder } = useOrders();
  const [cancelling, setCancelling] = useState(false);

  if (!order) return null;

  const onCancel = () =>
    confirmAction({
      title: 'Cancelar pedido',
      message: '¿Seguro que deseas cancelar este pedido?',
      confirmText: 'Cancelar pedido',
      destructive: true,
      onConfirm: async () => {
        setCancelling(true);
        const result = await cancelOrder(order.id);
        setCancelling(false);
        if (!result.ok) {
          notify('Error', result.error);
          return;
        }
        notify('Pedido cancelado', 'Tu pedido fue cancelado.', () => navigation.goBack());
      },
    });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <View style={styles.flex}>
          <Text style={styles.title}>{order.restaurantName}</Text>
          <Text style={styles.date}>{formatDateTime(order.createdAt)}</Text>
        </View>
        <Badge label={order.statusLabel} tone={order.statusTone} />
      </View>

      <Card>
        <OrderStatusTracker status={order.status} />
      </Card>

      <OrderItemsList items={order.items} />
      <OrderInfoCard order={order} />

      {isOrderCancellable(order.status) ? (
        <Button title="Cancelar pedido" variant="danger" onPress={onCancel} loading={cancelling} />
      ) : null}
    </ScrollView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: SPACING.lg, gap: SPACING.md },
  flex: { flex: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: SPACING.md },
  title: { fontSize: FONT_SIZE.xl, fontFamily: FONTS.displayBold, fontWeight: '800', color: colors.text },
  date: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.body, color: colors.textMuted, marginTop: 2 },
});
