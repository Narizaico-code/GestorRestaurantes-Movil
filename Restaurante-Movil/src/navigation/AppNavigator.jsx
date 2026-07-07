import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';

import { useThemeStore } from '../shared/hooks/useThemeStore';
import { useAuthStore } from '../shared/store/authStore';
import { AuthStack } from './AuthStack';
import { MainTabs } from './MainTabs';

// Decide Auth vs Main según el authStore, con guarda anti-parpadeo de hidratación.
export function AppNavigator() {
  const { colors, isDark } = useThemeStore();
  const styles = createStyles(colors);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme : DefaultTheme).colors,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
    },
  };

  // Mientras Zustand no rehidrate desde AsyncStorage, mostramos SOLO una pantalla
  // de carga (sin NavigationContainer) para evitar el parpadeo del Login.
  if (!hasHydrated) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}

const createStyles = (colors) => StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
