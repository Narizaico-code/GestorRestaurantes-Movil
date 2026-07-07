import { useMemo, useState } from 'react';
import { FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Card, EmptyState, Input, LoadingSpinner } from '../../../shared/components';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { useRestaurants } from '../hooks/useRestaurants';

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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return restaurants;
    return restaurants.filter(
      (r) => r.name.toLowerCase().includes(q) || r.address.toLowerCase().includes(q)
    );
  }, [restaurants, query]);

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
          <Input
            leftIcon="search"
            placeholder="Buscar restaurante o zona"
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            style={styles.search}
          />
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
  search: { marginBottom: SPACING.xs },
  card: { padding: 0, overflow: 'hidden' },
  cover: { width: '100%', height: 150, backgroundColor: colors.surfaceAlt },
  coverPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  body: { padding: SPACING.lg, gap: SPACING.xs },
  name: { fontSize: FONT_SIZE.lg, fontFamily: FONTS.displayBold, fontWeight: '700', color: colors.text },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  meta: { flex: 1, fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: colors.textMuted },
});
