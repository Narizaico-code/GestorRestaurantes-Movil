import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Button, Card, Input } from '../../../shared/components';
import { FONTS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { ReservationFormFields } from '../components/ReservationFormFields';
import { ReservationTableSelector } from '../components/ReservationTableSelector';
import { useReservationForm } from '../hooks/useReservationForm';
import { useTables } from '../hooks/useTables';

export function NewReservationScreen({ navigation, route }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const restaurant = route.params?.restaurant;
  const { tables, loading: tablesLoading } = useTables(restaurant?.id);

  const { control, errors, type, setType, selectedTables, toggleTable, submit, submitting } = useReservationForm({
    mode: 'create',
    restaurant,
    onSuccess: () => navigation.navigate('MyReservations'),
  });

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

        <ReservationFormFields control={control} errors={errors} type={type} setType={setType} />

        <ReservationTableSelector
          tables={tables}
          loading={tablesLoading}
          selectedTables={selectedTables}
          onToggle={toggleTable}
        />

        <Button title="Confirmar reservación" gradient onPress={submit} loading={submitting} />
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
});
