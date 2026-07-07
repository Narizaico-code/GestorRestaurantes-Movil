import { Controller, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { Button, Input } from '../../../shared/components';
import { notify } from '../../../shared/utils/confirm';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { isValidEmail } from '../../../shared/utils/validators';
import { useAuth } from '../hooks/useAuth';

export function ForgotPasswordScreen({ navigation }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const { forgotPassword, loading } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: '' } });

  const onSubmit = async (values) => {
    const result = await forgotPassword(values.email.trim());
    if (!result.ok) {
      notify('Error', result.error);
      return;
    }
    notify(
      'Revisa tu correo',
      'Si el correo existe, enviamos un enlace para restablecer tu contraseña.',
      () => navigation.navigate('Login')
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.iconCircle}>
          <MaterialIcons name="lock-reset" size={38} color={colors.primary} />
        </View>
        <Text style={styles.title}>Recuperar contraseña</Text>
        <Text style={styles.subtitle}>Te enviaremos un enlace para restablecerla.</Text>

        <Controller
          control={control}
          name="email"
          rules={{
            required: 'El correo es requerido',
            validate: (v) => isValidEmail(v) || 'Correo inválido',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Correo electrónico"
              leftIcon="mail-outline"
              autoCapitalize="none"
              keyboardType="email-address"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
            />
          )}
        />

        <Button title="Enviar enlace" gradient onPress={handleSubmit(onSubmit)} loading={loading} />
        <Button title="Volver" variant="ghost" onPress={() => navigation.goBack()} style={styles.spaced} />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: SPACING.xl },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: RADIUS.pill,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  title: { fontSize: FONT_SIZE.xxl, fontFamily: FONTS.displayBold, fontWeight: '800', color: colors.text, textAlign: 'center' },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  spaced: { marginTop: SPACING.sm },
});
