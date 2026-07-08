import { memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Badge, Card } from '../../../shared/components';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { formatCurrency } from '../../../shared/utils/format';

// Tarjeta de un platillo en la grilla de la carta (2 columnas, foto grande).
// Presentacional: recibe el viewmodel ya mapeado (de useMenus). Tocar la tarjeta
// abre el detalle (con reseñas incluidas); el botón "+" flotante sobre la foto
// agrega directo al carrito sin salir de la carta.
export const MenuCard = memo(function MenuCard({ menu, onAdd, onPress }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress?.(menu)}
      disabled={!onPress}
      style={styles.wrapper}
    >
      <Card style={styles.card}>
        <View style={styles.imageWrap}>
          {menu.image ? (
            <Image source={{ uri: menu.image }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <MaterialIcons name="restaurant-menu" size={28} color={colors.primary} />
            </View>
          )}
          {menu.isAvailable ? (
            <TouchableOpacity style={styles.addBtn} onPress={() => onAdd(menu)} activeOpacity={0.8}>
              <MaterialIcons name="add" size={20} color={colors.white} />
            </TouchableOpacity>
          ) : (
            <View style={styles.unavailableBadge}>
              <Badge label="Agotado" tone="danger" />
            </View>
          )}
        </View>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{menu.name}</Text>
          {menu.description ? (
            <Text style={styles.description} numberOfLines={1}>{menu.description}</Text>
          ) : null}
          <Text style={styles.price}>{formatCurrency(menu.price)}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
});

const createStyles = (colors) => StyleSheet.create({
  wrapper: { width: '48%' },
  card: { padding: 0, overflow: 'hidden' },
  imageWrap: { position: 'relative' },
  image: { width: '100%', height: 100, backgroundColor: colors.surfaceAlt },
  imagePlaceholder: { alignItems: 'center', justifyContent: 'center' },
  addBtn: {
    position: 'absolute',
    right: SPACING.xs,
    bottom: SPACING.xs,
    width: 34,
    height: 34,
    borderRadius: RADIUS.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unavailableBadge: { position: 'absolute', top: SPACING.xs, left: SPACING.xs },
  info: { padding: SPACING.sm, gap: 2 },
  name: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.semibold, fontWeight: '700', color: colors.text },
  description: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.body, color: colors.textMuted },
  price: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.bold, fontWeight: '800', color: colors.primary, marginTop: 2 },
});
