import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';

// Grid de chips de mesas seleccionables. Reutilizado en alta y edición de reservaciones.
export function ReservationTableSelector({ tables, loading, selectedTables, onToggle }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  const selectedCapacity = tables
    .filter((t) => selectedTables.includes(t.id))
    .reduce((sum, t) => sum + t.capacity, 0);

  return (
    <View>
      <Text style={styles.label}>Mesas disponibles</Text>
      {loading ? (
        <Text style={styles.muted}>Cargando mesas...</Text>
      ) : tables.length === 0 ? (
        <Text style={styles.muted}>Este restaurante no tiene mesas disponibles por ahora.</Text>
      ) : (
        <View style={styles.tableGrid}>
          {tables.map((table) => {
            const selected = selectedTables.includes(table.id);
            return (
              <TouchableOpacity
                key={table.id}
                style={[styles.tableChip, selected && styles.tableChipSelected]}
                onPress={() => onToggle(table.id)}
                activeOpacity={0.8}
              >
                <MaterialIcons
                  name="table-restaurant"
                  size={18}
                  color={selected ? colors.white : colors.primary}
                />
                <Text style={[styles.tableName, selected && styles.tableNameSelected]}>{table.name}</Text>
                <Text style={[styles.tableCap, selected && styles.tableNameSelected]}>{table.capacity} pers.</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
      {selectedTables.length > 0 ? (
        <Text style={styles.capacityHint}>Capacidad seleccionada: {selectedCapacity} personas</Text>
      ) : null}
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  label: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.semibold,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: SPACING.sm,
  },
  muted: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: colors.textMuted },
  tableGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.sm },
  tableChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  tableChipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  tableName: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.semibold, fontWeight: '700', color: colors.text },
  tableNameSelected: { color: colors.white },
  tableCap: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.body, color: colors.textMuted },
  capacityHint: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.medium, color: colors.textSecondary, marginBottom: SPACING.lg },
});
