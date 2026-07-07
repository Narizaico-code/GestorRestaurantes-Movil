import { memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Badge, Card } from '../../../shared/components';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { formatCurrency } from '../../../shared/utils/format';

// Fila de un platillo dentro de la carta. Presentacional: recibe el viewmodel
// ya mapeado (de useMenus) y delega la acción de agregar al carrito al padre.
export const MenuCard = memo(function MenuCard({ menu, onAdd }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  return (
    <Card style={styles.card}>
      {menu.image ? (
        <Image source={{ uri: menu.image }} style={styles.thumb} />
      ) : (
        <View style={[styles.thumb, styles.thumbPlaceholder]}>
          <MaterialIcons name="restaurant-menu" size={20} color={colors.primary} />
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{menu.name}</Text>
        {menu.description ? (
          <Text style={styles.description} numberOfLines={2}>{menu.description}</Text>
        ) : null}
        <Text style={styles.price}>{formatCurrency(menu.price)}</Text>
      </View>
      {menu.isAvailable ? (
        <TouchableOpacity style={styles.addBtn} onPress={() => onAdd(menu)} activeOpacity={0.8}>
          <MaterialIcons name="add" size={22} color={colors.white} />
        </TouchableOpacity>
      ) : (
        <Badge label="Agotado" tone="danger" />
      )}
    </Card>
  );
});

const createStyles = (colors) => StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  thumb: { width: 56, height: 56, borderRadius: RADIUS.md, backgroundColor: colors.surfaceAlt },
  thumbPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, gap: 2 },
  name: { fontSize: FONT_SIZE.md, fontFamily: FONTS.semibold, fontWeight: '700', color: colors.text },
  description: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.body, color: colors.textMuted },
  price: { fontSize: FONT_SIZE.md, fontFamily: FONTS.bold, fontWeight: '800', color: colors.primary, marginTop: 2 },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
