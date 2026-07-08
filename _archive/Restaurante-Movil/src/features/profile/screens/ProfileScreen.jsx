import { RefreshControl, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Button, Card, DetailRow, IconCircle, LoadingSpinner } from '../../../shared/components';
import { FONTS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { confirmAction } from '../../../shared/utils/confirm';
import { useProfile } from '../hooks/useProfile';
import { ProfileHeader } from './ProfileHeader';

const MENU = [
  { icon: 'lock-reset', label: 'Cambiar contraseña', screen: 'ChangePassword' },
  { icon: 'local-offer', label: 'Promociones', screen: 'Promotions' },
  { icon: 'event-seat', label: 'Mis reservaciones', tab: 'Reservas', screen: 'MyReservations' },
  { icon: 'receipt-long', label: 'Mis pedidos', tab: 'Pedidos', screen: 'MyOrders' },
  { icon: 'request-quote', label: 'Mis facturas', screen: 'Invoices' },
];

export function ProfileScreen({ navigation }) {
  const { colors, isDark, toggleTheme } = useThemeStore();
  const styles = createStyles(colors);
  const { profile, loading, error, refetch, logout } = useProfile();

  const onLogout = () =>
    confirmAction({
      title: 'Cerrar sesión',
      message: '¿Seguro que deseas salir?',
      confirmText: 'Salir',
      destructive: true,
      onConfirm: logout,
    });

  const go = (item) => {
    if (item.tab) navigation.navigate(item.tab, { screen: item.screen });
    else navigation.navigate(item.screen);
  };

  if (loading && !profile) return <LoadingSpinner message="Cargando perfil..." />;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={colors.primary} />}
    >
      <ProfileHeader avatar={profile?.profilePicture} name={profile?.name} email={profile?.email} />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Card>
        <DetailRow label="Correo" value={profile?.email || 'N/D'} />
        <DetailRow label="Teléfono" value={profile?.phone || 'N/D'} />
        <DetailRow label="Dirección" value={profile?.address || 'N/D'} last />
        <Button
          title="Editar perfil"
          variant="secondary"
          onPress={() => navigation.navigate('EditProfile', { profile })}
          style={styles.editBtn}
        />
      </Card>

      {/* Modo oscuro */}
      <Card style={styles.themeCard}>
        <View style={styles.themeRow}>
          <View style={styles.themeLeft}>
            <IconCircle icon={isDark ? 'dark-mode' : 'light-mode'} size={40} />
            <View>
              <Text style={styles.themeLabel}>Modo oscuro</Text>
              <Text style={styles.themeHint}>{isDark ? 'Activado' : 'Desactivado'}</Text>
            </View>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>
      </Card>

      <Card style={styles.menuCard}>
        {MENU.map((item) => (
          <TouchableOpacity key={item.label} style={styles.menuRow} onPress={() => go(item)}>
            <IconCircle icon={item.icon} size={40} />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <MaterialIcons name="chevron-right" size={22} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </Card>

      <Button title="Cerrar sesión" variant="danger" onPress={onLogout} />

      <TouchableOpacity onPress={() => navigation.navigate('DeleteAccount')} style={styles.deleteAccountLink}>
        <Text style={styles.deleteAccountText}>Eliminar mi cuenta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: SPACING.lg, gap: SPACING.md },
  error: { color: colors.danger, fontFamily: FONTS.medium, fontSize: FONT_SIZE.sm },
  editBtn: { marginTop: SPACING.md },
  themeCard: { gap: SPACING.xs },
  themeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  themeLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  themeLabel: { fontSize: FONT_SIZE.md, fontFamily: FONTS.semibold, fontWeight: '600', color: colors.text },
  themeHint: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.body, color: colors.textMuted, marginTop: 2 },
  menuCard: { gap: SPACING.xs },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  menuLabel: { flex: 1, fontSize: FONT_SIZE.md, fontFamily: FONTS.semibold, fontWeight: '600', color: colors.text },
  deleteAccountLink: { alignItems: 'center', marginTop: SPACING.xs },
  deleteAccountText: { color: colors.danger, fontFamily: FONTS.medium, fontSize: FONT_SIZE.xs },
});
