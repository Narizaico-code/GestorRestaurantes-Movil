import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Button, Card, Input, Selector } from '../../../shared/components';
import { RESERVATION_TYPES, RESERVATION_TYPE_OPTIONS } from '../../../shared/constants';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { notify } from '../../../shared/utils/confirm';
import { combineDateTime } from '../../../shared/utils/format';
import { useReservations } from '../hooks/useReservations';
import { useTables } from '../hooks/useTables';

export function NewReservationScreen({ navigation, route }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const restaurant = route.params?.restaurant;
  const { createReservation } = useReservations();
  const { tables, loading: tablesLoading } = useTables(restaurant?.id);

  const [type, setType] = useState(RESERVATION_TYPES.PERSONAL);
  const [selectedTables, setSelectedTables] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { numberPeople: '2', date: '', startTime: '', endTime: '', description: '', coupon: '' },
  });

  const toggleTable = (tableId) => {
    setSelectedTables((prev) =>
      prev.includes(tableId) ? prev.filter((id) => id !== tableId) : [...prev, tableId]
    );
  };

  const selectedCapacity = tables
    .filter((t) => selectedTables.includes(t.id))
    .reduce((sum, t) => sum + t.capacity, 0);

  const onSubmit = async (values) => {
    if (!restaurant?.id) {
      notify('Error', 'No se identificó el restaurante.');
      return;
    }
    if (selectedTables.length === 0) {
      notify('Selecciona una mesa', 'Debes elegir al menos una mesa disponible.');
      return;
    }
    const start = combineDateTime(values.date, values.startTime);
    const end = combineDateTime(values.date, values.endTime);
    if (!start || !end) {
      notify('Fecha inválida', 'Revisa la fecha (AAAA-MM-DD) y las horas (HH:mm).');
      return;
    }
    if (end <= start) {
      notify('Horario inválido', 'La hora de fin debe ser posterior a la de inicio.');
      return;
    }
    if (type === RESERVATION_TYPES.EVENTO && !values.description.trim()) {
      notify('Falta descripción', 'La descripción es obligatoria para reservaciones tipo evento.');
      return;
    }

    setSubmitting(true);
    const result = await createReservation({
      restaurantId: restaurant.id,
      tableId: selectedTables,
      numberPeople: Number(values.numberPeople) || 1,
      typeReservation: type,
      description: values.description.trim(),
      coupon: values.coupon.trim(),
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    });
    setSubmitting(false);

    if (!result.ok) {
      notify('No se pudo reservar', result.error);
      return;
    }
    notify('Reservación creada', 'Tu reservación quedó pendiente de confirmación.', () =>
      navigation.navigate('MyReservations')
    );
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Card style={styles.restaurantCard}>
          <MaterialIcons name="restaurant" size={22} color={colors.primary} />
          <View style={styles.flex}>
            <Text style={styles.restaurantName}>{restaurant?.name || 'Restaurante'}</Text>
            <Text style={styles.muted}>{restaurant?.hoursLabel}</Text>
          </View>
        </Card>

        <Selector label="Tipo de reservación" options={RESERVATION_TYPE_OPTIONS} value={type} onChange={setType} />

        <Controller
          control={control}
          name="numberPeople"
          rules={{ required: 'Requerido', min: { value: 1, message: 'Mínimo 1' } }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Número de personas"
              leftIcon="group"
              keyboardType="number-pad"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.numberPeople?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="date"
          rules={{ required: 'Requerido', pattern: { value: /^\d{4}-\d{2}-\d{2}$/, message: 'Formato AAAA-MM-DD' } }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Fecha"
              leftIcon="calendar-today"
              placeholder="AAAA-MM-DD"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.date?.message}
            />
          )}
        />

        <View style={styles.timeRow}>
          <Controller
            control={control}
            name="startTime"
            rules={{ required: 'Requerido', pattern: { value: /^\d{1,2}:\d{2}$/, message: 'HH:mm' } }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Hora inicio"
                leftIcon="schedule"
                placeholder="19:00"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.startTime?.message}
                style={styles.timeInput}
              />
            )}
          />
          <Controller
            control={control}
            name="endTime"
            rules={{ required: 'Requerido', pattern: { value: /^\d{1,2}:\d{2}$/, message: 'HH:mm' } }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Hora fin"
                leftIcon="schedule"
                placeholder="21:00"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.endTime?.message}
                style={styles.timeInput}
              />
            )}
          />
        </View>

        {type === RESERVATION_TYPES.EVENTO ? (
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Descripción del evento"
                placeholder="Motivo, requerimientos, etc."
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
              />
            )}
          />
        ) : null}

        {/* Selección de mesas */}
        <Text style={styles.label}>Mesas disponibles</Text>
        {tablesLoading ? (
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
                  onPress={() => toggleTable(table.id)}
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

        <Controller
          control={control}
          name="coupon"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Cupón (opcional)"
              leftIcon="local-offer"
              autoCapitalize="characters"
              placeholder="CÓDIGO"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              style={styles.couponInput}
            />
          )}
        />

        <Button title="Confirmar reservación" gradient onPress={handleSubmit(onSubmit)} loading={submitting} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: SPACING.lg },
  restaurantCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.lg },
  restaurantName: { fontSize: FONT_SIZE.md, fontFamily: FONTS.semibold, fontWeight: '700', color: colors.text },
  muted: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: colors.textMuted },
  timeRow: { flexDirection: 'row', gap: SPACING.md },
  timeInput: { flex: 1 },
  label: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.semibold,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: SPACING.sm,
  },
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
  couponInput: { marginTop: SPACING.sm },
});
