import { RefreshControl, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Button, Card, LoadingSpinner } from '../../../shared/components';
import { FONTS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { confirmAction } from '../../../shared/utils/confirm';
import { useProfile } from '../hooks/useProfile';
import { ProfileHeader } from './ProfileHeader';

const MENU = [
  { icon: 'lock-reset', label: 'Cambiar contraseña', screen: 'ChangePassword' },
  { icon: 'local-offer', label: 'Promociones', screen: 'Promotions' },
  { icon: 'event-seat', label: 'Mis reservaciones', tab: 'Reservas', screen: 'MyReservations' },
  { icon: 'receipt-long', label: 'Mis pedidos', tab: 'Pedidos', screen: 'MyOrders' },
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
        <InfoRow label="Correo" value={profile?.email || 'N/D'} colors={colors} />
        <InfoRow label="Teléfono" value={profile?.phone || 'N/D'} colors={colors} />
        <InfoRow label="Dirección" value={profile?.address || 'N/D'} colors={colors} last />
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
            <View style={styles.themeIcon}>
              <MaterialIcons name={isDark ? 'dark-mode' : 'light-mode'} size={20} color={colors.primary} />
            </View>
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
            <View style={styles.menuIcon}>
              <MaterialIcons name={item.icon} size={20} color={colors.primary} />
            </View>
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

function InfoRow({ label, value, colors, last }) {
  const styles = createStyles(colors);
  return (
    <View style={[styles.infoRow, last && styles.infoRowLast]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: SPACING.lg, gap: SPACING.md },
  error: { color: colors.danger, fontFamily: FONTS.medium, fontSize: FONT_SIZE.sm },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  infoRowLast: { borderBottomWidth: 0 },
  infoLabel: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.body, color: colors.textSecondary },
  infoValue: { fontSize: FONT_SIZE.sm, fontFamily: FONTS.semibold, fontWeight: '700', color: colors.text },
  editBtn: { marginTop: SPACING.md },
  themeCard: { gap: SPACING.xs },
  themeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  themeLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  themeIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.pill,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.pill,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: { flex: 1, fontSize: FONT_SIZE.md, fontFamily: FONTS.semibold, fontWeight: '600', color: colors.text },
  deleteAccountLink: { alignItems: 'center', marginTop: SPACING.xs },
  deleteAccountText: { color: colors.danger, fontFamily: FONTS.medium, fontSize: FONT_SIZE.xs },
});
