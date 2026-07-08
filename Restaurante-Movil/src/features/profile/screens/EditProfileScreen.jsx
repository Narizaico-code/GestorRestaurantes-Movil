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
import { MaterialIcons } from '@expo/vector-icons';

import { Button, Input } from '../../../shared/components';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { notify } from '../../../shared/utils/confirm';
import { sanitizeDigits } from '../../../shared/utils/format';
import { pickImage } from '../../../shared/utils/imagePicker';
import { isValidEmail } from '../../../shared/utils/validators';
import { useProfile } from '../hooks/useProfile';

export function EditProfileScreen({ navigation, route }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const { profile: fetched, updateProfile } = useProfile();
  const initial = route.params?.profile || fetched;
  const [imageUri, setImageUri] = useState(null);
  const [existingImageFailed, setExistingImageFailed] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    values: {
      name: initial?.name || '',
      email: initial?.email || '',
      phone: initial?.phone || '',
      address: initial?.address || '',
    },
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
    const result = await updateProfile({
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      address: values.address.trim(),
      profilePicture: imageUri,
    });
    if (!result.ok) {
      notify('Error', result.error);
      return;
    }
    notify('Perfil actualizado', 'Tus datos se guardaron correctamente.', () => navigation.goBack());
  };

  // Prioriza la foto recién elegida; si no hay, muestra la actual del perfil
  // (a menos que ya haya fallado al cargar, ej. avatar por defecto roto).
  const displayUri = imageUri || (!existingImageFailed ? initial?.profilePicture : null);

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.avatarPicker} onPress={handlePickImage}>
          {displayUri ? (
            <Image
              source={{ uri: displayUri }}
              style={styles.avatar}
              onError={() => setExistingImageFailed(true)}
            />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <MaterialIcons name="add-a-photo" size={28} color={colors.primary} />
            </View>
          )}
          <Text style={styles.link}>Cambiar foto de perfil</Text>
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
          name="phone"
          rules={{ pattern: { value: /^\d{8}$/, message: 'Debe tener 8 dígitos' } }}
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
        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Dirección (opcional)"
              leftIcon="location-on"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              multiline
            />
          )}
        />

        <Button title="Guardar cambios" gradient onPress={handleSubmit(onSubmit)} loading={isSubmitting} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: SPACING.xl },
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
});
