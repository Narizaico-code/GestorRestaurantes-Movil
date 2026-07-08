import { useMemo, useState } from 'react';
import { FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Badge, Card, EmptyState, Input, LoadingSpinner, Selector } from '../../../shared/components';
import { MENU_CATEGORY_LABELS, MENU_CATEGORY_ORDER } from '../../../shared/constants';
import { FONTS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { useRestaurants } from '../hooks/useRestaurants';

const RESTAURANT_QUICK_FILTERS = [
  { value: 'ALL', label: 'Todos' },
  { value: 'OPEN_NOW', label: 'Abiertos ahora' },
  { value: 'AVAILABLE_MENU', label: 'Con platillos disponibles' },
];

const MENU_CATEGORY_FILTERS = [
  { value: 'ALL', label: 'Todas las categorías' },
  ...MENU_CATEGORY_ORDER.map((category) => ({
    value: category,
    label: MENU_CATEGORY_LABELS[category] || category,
  })),
];

const toMinutes = (timeValue) => {
  if (!timeValue) return null;
  const normalized = String(timeValue).trim().toLowerCase();
  const match = normalized.match(/^(\d{1,2}):(\d{2})(?:\s*(am|pm))?$/);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3];

  if (Number.isNaN(hours) || Number.isNaN(minutes) || minutes > 59 || hours > 23) return null;
  if (meridiem === 'pm' && hours < 12) hours += 12;
  if (meridiem === 'am' && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

const isRestaurantOpenNow = (restaurant, now = new Date()) => {
  const open = toMinutes(restaurant?.openingHours);
  const close = toMinutes(restaurant?.closingHours);
  if (open === null || close === null) return true;

  const current = now.getHours() * 60 + now.getMinutes();
  if (open <= close) return current >= open && current <= close;
  return current >= open || current <= close;
};

// Sub-componente local: sólo se usa aquí (no se sube a shared hasta reutilizarse).
function RestaurantCard({ restaurant, colors, onPress }) {
  const styles = createStyles(colors);
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <Card style={styles.card}>
        {restaurant.image ? (
          <Image source={{ uri: restaurant.image }} style={styles.cover} />
        ) : (
          <View style={[styles.cover, styles.coverPlaceholder]}>
            <MaterialIcons name="restaurant" size={30} color={colors.primary} />
          </View>
        )}
        <View style={styles.body}>
          <Text style={styles.name} numberOfLines={1}>{restaurant.name}</Text>
          <View style={styles.metaRow}>
            <MaterialIcons name="place" size={14} color={colors.textMuted} />
            <Text style={styles.meta} numberOfLines={1}>{restaurant.address || 'Dirección no disponible'}</Text>
          </View>
          <View style={styles.metaRow}>
            <MaterialIcons name="schedule" size={14} color={colors.textMuted} />
            <Text style={styles.meta}>{restaurant.hoursLabel}</Text>
          </View>
          <View style={styles.metaRow}>
            <MaterialIcons name="payments" size={14} color={colors.textMuted} />
            <Text style={styles.meta} numberOfLines={1}>{restaurant.priceRangeLabel}</Text>
          </View>
          <View style={styles.chipsRow}>
            {restaurant.hasAvailableMenu ? (
              <Badge label={`${restaurant.availableMenusCount} disponibles`} tone="success" />
            ) : (
              <Badge label="Sin disponibilidad" tone="danger" />
            )}
            {restaurant.categories.slice(0, 2).map((category) => (
              <Badge key={category} label={category} tone="info" />
            ))}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

export function RestaurantsScreen({ navigation }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const { restaurants, loading, error, refetch } = useRestaurants();
  const [query, setQuery] = useState('');
  const [quickFilter, setQuickFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return restaurants.filter((restaurant) => {
      const matchesQuery =
        !q ||
        restaurant.name.toLowerCase().includes(q) ||
        restaurant.address.toLowerCase().includes(q) ||
        restaurant.categories.some((category) => category.toLowerCase().includes(q));

      if (!matchesQuery) return false;
      if (quickFilter === 'OPEN_NOW' && !isRestaurantOpenNow(restaurant)) return false;
      if (quickFilter === 'AVAILABLE_MENU' && !restaurant.hasAvailableMenu) return false;
      if (categoryFilter !== 'ALL' && !restaurant.categoryCodes.includes(categoryFilter)) return false;

      return true;
    });
  }, [restaurants, query, quickFilter, categoryFilter]);

  if (loading && restaurants.length === 0) {
    return <LoadingSpinner message="Cargando restaurantes..." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.filtersWrapper}>
            <Input
              leftIcon="search"
              placeholder="Buscar restaurante, zona o categoría"
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              style={styles.search}
            />
            <Selector
              label="Filtro rápido"
              options={RESTAURANT_QUICK_FILTERS}
              value={quickFilter}
              onChange={setQuickFilter}
            />
            <Selector
              label="Categoría"
              options={MENU_CATEGORY_FILTERS}
              value={categoryFilter}
              onChange={setCategoryFilter}
            />
          </View>
        }
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={colors.primary} />}
        ListEmptyComponent={
          <EmptyState
            icon="storefront"
            title="Sin restaurantes"
            message={error || 'No encontramos restaurantes que coincidan con tu búsqueda.'}
          />
        }
        renderItem={({ item }) => (
          <RestaurantCard
            restaurant={item}
            colors={colors}
            onPress={() => navigation.navigate('RestaurantDetail', { restaurant: item })}
          />
        )}
      />
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: SPACING.lg, gap: SPACING.md },
  filtersWrapper: { marginBottom: SPACING.xs },
  search: { marginBottom: SPACING.md },
  card: { padding: 0, overflow: 'hidden' },
  cover: { width: '100%', height: 150, backgroundColor: colors.surfaceAlt },
  coverPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  body: { padding: SPACING.lg, gap: SPACING.xs },
  name: { fontSize: FONT_SIZE.lg, fontFamily: FONTS.displayBold, fontWeight: '700', color: colors.text },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  meta: { flex: 1, fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: colors.textMuted },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginTop: SPACING.xs },
});
