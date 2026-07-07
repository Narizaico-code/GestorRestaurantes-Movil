import { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import { Literata_600SemiBold, Literata_700Bold } from '@expo-google-fonts/literata';

import { AppNavigator } from './src/navigation/AppNavigator';
import { useThemeStore } from './src/shared/hooks/useThemeStore';

// Mantén el splash hasta que las fuentes de marca (Space Grotesk + Literata) carguen.
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const { colors, isDark } = useThemeStore();
  const [fontsLoaded, fontError] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
    Literata_600SemiBold,
    Literata_700Bold,
  });

  // Si las fuentes fallan, no bloqueamos la app: cae al sistema.
  const ready = fontsLoaded || fontError;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  const onLayout = useCallback(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: colors.background }} onLayout={onLayout}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <AppNavigator />
      </View>
    </SafeAreaProvider>
  );
}
