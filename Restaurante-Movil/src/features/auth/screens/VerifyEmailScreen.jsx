import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, IconCircle, Input } from '../../../shared/components';
import { notify } from '../../../shared/utils/confirm';
import { FONTS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { useAuth } from '../hooks/useAuth';

// El backend envía un token largo por correo. El usuario puede pegarlo aquí para
// verificar sin salir de la app, o reenviar el correo si no llegó.
export function VerifyEmailScreen({ navigation, route }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const { verifyEmail, resendVerification, loading } = useAuth();
  const email = route.params?.email || '';
  const [token, setToken] = useState('');

  const onVerify = async () => {
    if (!token.trim()) {
      notify('Falta el token', 'Pega el código de verificación que recibiste por correo.');
      return;
    }
    const result = await verifyEmail(token.trim());
    if (!result.ok) {
      notify('Error', result.error);
      return;
    }
    notify('Correo verificado', 'Tu cuenta está activa. Ya puedes iniciar sesión.', () =>
      navigation.navigate('Login')
    );
  };

  const onResend = async () => {
    if (!email) {
      notify('Falta el correo', 'Vuelve al registro para reenviar el correo.');
      return;
    }
    const result = await resendVerification(email);
    notify(result.ok ? 'Correo enviado' : 'Aviso', result.ok ? 'Revisa tu bandeja de entrada.' : result.error);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <IconCircle icon="mark-email-read" size={76} style={styles.iconCircle} />
        <Text style={styles.title}>Verifica tu correo</Text>
        <Text style={styles.subtitle}>
          Enviamos un enlace de verificación{email ? ` a ${email}` : ''}. Pega aquí el código del enlace si prefieres
          verificar dentro de la app.
        </Text>

        <Input
          label="Código de verificación"
          leftIcon="vpn-key"
          placeholder="Pega el token del correo"
          autoCapitalize="none"
          value={token}
          onChangeText={setToken}
        />

        <Button title="Verificar" gradient onPress={onVerify} loading={loading} />
        <Button title="Reenviar correo" variant="secondary" onPress={onResend} style={styles.spaced} />
        <Button title="Ir a iniciar sesión" variant="ghost" onPress={() => navigation.navigate('Login')} />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: SPACING.xl, alignItems: 'stretch' },
  iconCircle: { alignSelf: 'center', marginBottom: SPACING.lg },
  title: { fontSize: FONT_SIZE.xxl, fontFamily: FONTS.displayBold, fontWeight: '800', color: colors.text, textAlign: 'center' },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
    lineHeight: 20,
  },
  spaced: { marginTop: SPACING.sm },
});
