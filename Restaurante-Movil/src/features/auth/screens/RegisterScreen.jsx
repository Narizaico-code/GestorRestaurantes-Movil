import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { Button, Input, PasswordRulesChecklist } from '../../../shared/components';
import { notify } from '../../../shared/utils/confirm';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { sanitizeDigits } from '../../../shared/utils/format';
import { pickImage } from '../../../shared/utils/imagePicker';
import { isValidEmail, isValidPassword } from '../../../shared/utils/validators';
import { useAuth } from '../hooks/useAuth';

export function RegisterScreen({ navigation }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const { register, loading } = useAuth();
  const [imageUri, setImageUri] = useState(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { name: '', email: '', password: '', phone: '' },
  });

  const handlePickImage = async () => {
    const result = await pickImage();
    if (result.error) {
      notify('Permiso requerido', result.error);
      return;
    }
    if (!result.canceled) setImageUri(result.uri);
  };

  const onSubmit = async (values) => {
    const result = await register({
      name: values.name.trim(),
      email: values.email.trim(),
      password: values.password,
      phone: values.phone.trim(),
      profilePicture: imageUri,
    });
    if (!result.ok) {
      notify('Error', result.error);
      return;
    }
    notify(
      'Cuenta creada',
      'Revisa tu correo y verifica tu cuenta para poder iniciar sesión.',
      () => navigation.navigate('VerifyEmail', { email: values.email.trim() })
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>Regístrate para reservar mesas y hacer pedidos.</Text>

          <TouchableOpacity style={styles.avatarPicker} onPress={handlePickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <MaterialIcons name="add-a-photo" size={28} color={colors.primary} />
              </View>
            )}
            <Text style={styles.link}>Foto de perfil (opcional)</Text>
          </TouchableOpacity>

          <Controller
            control={control}
            name="name"
            rules={{ required: 'El nombre es requerido' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Nombre completo"
                leftIcon="person-outline"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.name?.message}
              />
            )}
          />
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
          <Controller
            control={control}
            name="password"
            rules={{
              required: 'La contraseña es requerida',
              validate: (v) => isValidPassword(v) || 'La contraseña no cumple los requisitos',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <Input
                  label="Contraseña"
                  leftIcon="lock-outline"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                />
                <PasswordRulesChecklist password={value} />
              </>
            )}
          />
          <Controller
            control={control}
            name="phone"
            rules={{
              required: 'El teléfono es requerido',
              pattern: { value: /^\d{8}$/, message: 'Debe tener 8 dígitos' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Teléfono"
                leftIcon="phone-iphone"
                keyboardType="number-pad"
                maxLength={8}
                placeholder="12345678"
                value={value}
                onChangeText={(text) => onChange(sanitizeDigits(text, 8))}
                onBlur={onBlur}
                error={errors.phone?.message}
              />
            )}
          />

          <Button title="Crear cuenta" gradient onPress={handleSubmit(onSubmit)} loading={loading} />

          <View style={styles.footer}>
            <Text style={styles.muted}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { padding: SPACING.xl },
  title: { fontSize: FONT_SIZE.xxl, fontFamily: FONTS.displayBold, fontWeight: '800', color: colors.brand },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.body,
    color: colors.textSecondary,
    marginBottom: SPACING.xl,
    marginTop: SPACING.xs,
  },
  avatarPicker: { alignItems: 'center', marginBottom: SPACING.xl, gap: SPACING.sm },
  avatar: { width: 88, height: 88, borderRadius: RADIUS.pill },
  avatarPlaceholder: {
    width: 88,
    height: 88,
    borderRadius: RADIUS.pill,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: { color: colors.primary, fontFamily: FONTS.bold, fontWeight: '700', fontSize: FONT_SIZE.sm },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.xl },
  muted: { color: colors.textSecondary, fontFamily: FONTS.body, fontSize: FONT_SIZE.sm },
});
