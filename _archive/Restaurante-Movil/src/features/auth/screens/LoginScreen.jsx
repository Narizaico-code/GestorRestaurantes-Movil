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
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Input } from '../../../shared/components';
import { notify } from '../../../shared/utils/confirm';
import { GRADIENTS, FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { isValidEmail } from '../../../shared/utils/validators';
import { useAuth } from '../hooks/useAuth';

export function LoginScreen({ navigation }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const { login, loading } = useAuth();
  const insets = useSafeAreaInsets();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: '', password: '' } });

  const onSubmit = async (values) => {
    const result = await login({ email: values.email.trim(), password: values.password });
    if (!result.ok) notify('Error', result.error);
    // En éxito, el authStore cambia isAuthenticated y AppNavigator monta los Tabs.
  };

  return (
    <View style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <LinearGradient
            colors={GRADIENTS.hero}
            start={GRADIENTS.start}
            end={GRADIENTS.endDiagonal}
            style={[styles.hero, { paddingTop: insets.top + SPACING.xxl }]}
          >
            <View style={styles.brandBadge}>
              <MaterialIcons name="restaurant" size={30} color={colors.white} />
            </View>
            <Text style={styles.brand}>Sabor a la Carta</Text>
            <Text style={styles.tagline}>Bienvenido de nuevo</Text>
          </LinearGradient>

          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Inicia sesión</Text>
            <Text style={styles.formSubtitle}>Ingresa tus datos para continuar</Text>

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
                  placeholder="tucorreo@ejemplo.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              rules={{ required: 'La contraseña es requerida' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Contraseña"
                  leftIcon="lock-outline"
                  placeholder="••••••••"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                />
              )}
            />

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.linkRight}>
              <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            <Button title="Iniciar sesión" gradient onPress={handleSubmit(onSubmit)} loading={loading} />

            <View style={styles.footer}>
              <Text style={styles.muted}>¿No tienes cuenta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.link}>Regístrate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  scroll: { flexGrow: 1 },
  hero: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },
  brandBadge: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.pill,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  brand: {
    fontSize: FONT_SIZE.xxl,
    fontFamily: FONTS.displayBold,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.body,
    color: 'rgba(255,255,255,0.8)',
    marginTop: SPACING.xs,
  },
  formCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    marginTop: -SPACING.xl,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  formTitle: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONTS.displayBold,
    fontWeight: '700',
    color: colors.text,
  },
  formSubtitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.body,
    color: colors.textSecondary,
    marginTop: SPACING.xs,
    marginBottom: SPACING.xl,
  },
  linkRight: { alignSelf: 'flex-end', marginBottom: SPACING.lg },
  link: { color: colors.primary, fontFamily: FONTS.bold, fontWeight: '700', fontSize: FONT_SIZE.sm },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.xl },
  muted: { color: colors.textSecondary, fontFamily: FONTS.body, fontSize: FONT_SIZE.sm },
});
