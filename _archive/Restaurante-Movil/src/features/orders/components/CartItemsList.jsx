import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Card, Stepper } from '../../../shared/components';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { formatCurrency } from '../../../shared/utils/format';

// Lista de artículos del carrito, con control de cantidad y opción de quitar.
export function CartItemsList({ items, onChangeQuantity, onRemove }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  return (
    <>
      {items.map((item) => (
        <Card key={item.menuId} style={styles.itemCard}>
          {item.menuPhoto ? (
            <Image source={{ uri: item.menuPhoto }} style={styles.thumb} />
          ) : (
            <View style={[styles.thumb, styles.thumbPlaceholder]}>
              <MaterialIcons name="restaurant-menu" size={18} color={colors.primary} />
            </View>
          )}
          <View style={styles.itemInfo}>
            <Text style={styles.itemName} numberOfLines={1}>{item.menuName}</Text>
            <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
          </View>
          <View style={styles.itemActions}>
            <Stepper value={item.quantity} onChange={(q) => onChangeQuantity(item.menuId, q)} />
            <TouchableOpacity onPress={() => onRemove(item.menuId)} hitSlop={8}>
              <MaterialIcons name="delete-outline" size={20} color={colors.danger} />
            </TouchableOpacity>
          </View>
        </Card>
      ))}
    </>
  );
}

const createStyles = (colors) => StyleSheet.create({
  itemCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  thumb: { width: 48, height: 48, borderRadius: RADIUS.md, backgroundColor: colors.surfaceAlt },
  thumbPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  itemInfo: { flex: 1, gap: 2 },
  itemName: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.semibold, fontWeight: '700', color: colors.text },
  itemPrice: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.bold, fontWeight: '800', color: colors.primary },
  itemActions: { alignItems: 'flex-end', gap: SPACING.xs },
});
