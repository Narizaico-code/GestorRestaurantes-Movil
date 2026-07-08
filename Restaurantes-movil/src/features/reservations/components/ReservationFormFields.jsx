import { Controller } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { Input, Selector } from '../../../shared/components';
import { RESERVATION_TYPES, RESERVATION_TYPE_OPTIONS } from '../../../shared/constants';
import { SPACING } from '../../../shared/constants/theme';

// Campos controlados del formulario de reservación (alta y edición comparten este bloque).
export function ReservationFormFields({ control, errors, type, setType }) {
  return (
    <View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  timeRow: { flexDirection: 'row', gap: SPACING.md },
  timeInput: { flex: 1 },
  couponInput: { marginTop: SPACING.sm },
});
