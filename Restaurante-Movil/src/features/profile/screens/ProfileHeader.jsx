import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { GradientCard } from '../../../shared/components';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';

// Encabezado de perfil con gradiente de marca, avatar, nombre y correo.
// Si la imagen no carga (ej. avatar por defecto roto en el servidor), cae al
// ícono de placeholder en vez de dejar un hueco en blanco.
export function ProfileHeader({ avatar, name, email }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [avatar]);

  const showImage = Boolean(avatar) && !imageFailed;

  return (
    <GradientCard contentStyle={styles.inner}>
      <View style={styles.avatarWrap}>
        {showImage ? (
          <Image source={{ uri: avatar }} style={styles.avatar} onError={() => setImageFailed(true)} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <MaterialIcons name="person" size={34} color={colors.white} />
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{name || 'Invitado'}</Text>
        <Text style={styles.email} numberOfLines={1}>{email || ''}</Text>
      </View>
    </GradientCard>
  );
}

const createStyles = (colors) => StyleSheet.create({
  inner: { flexDirection: 'row', alignItems: 'center', gap: SPACING.lg },
  avatarWrap: {
    padding: 3,
    borderRadius: RADIUS.pill,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  avatar: { width: 66, height: 66, borderRadius: RADIUS.pill, backgroundColor: 'rgba(255,255,255,0.15)' },
  avatarPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  name: { fontSize: FONT_SIZE.xl, fontFamily: FONTS.displayBold, fontWeight: '800', color: colors.white },
  email: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
});
