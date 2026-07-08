import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

import { Button, Input, PasswordRulesChecklist } from '../../../shared/components';
import { SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { notify } from '../../../shared/utils/confirm';
import { isValidPassword } from '../../../shared/utils/validators';
import { useAccount } from '../hooks/useAccount';

export function ChangePasswordScreen({ navigation }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const { changePassword, loading } = useAccount();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' } });

  const newPassword = watch('newPassword');

  const onSubmit = async (values) => {
    const result = await changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
    if (!result.ok) {
      notify('Error', result.error);
      return;
    }
    notify('Contraseña actualizada', 'Tu contraseña se cambió correctamente.', () => navigation.goBack());
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Controller
          control={control}
          name="currentPassword"
          rules={{ required: 'La contraseña actual es requerida' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Contraseña actual"
              leftIcon="lock-outline"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.currentPassword?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="newPassword"
          rules={{
            required: 'La nueva contraseña es requerida',
            validate: (v) => isValidPassword(v) || 'La contraseña no cumple los requisitos',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <Input
                label="Nueva contraseña"
                leftIcon="lock-reset"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.newPassword?.message}
              />
              <PasswordRulesChecklist password={value} />
            </>
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: 'Confirma la nueva contraseña',
            validate: (v) => v === newPassword || 'Las contraseñas no coinciden',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Confirmar nueva contraseña"
              leftIcon="lock-outline"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.confirmPassword?.message}
            />
          )}
        />

        <Button title="Actualizar contraseña" gradient onPress={handleSubmit(onSubmit)} loading={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: SPACING.xl },
});
