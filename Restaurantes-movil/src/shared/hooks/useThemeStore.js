import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LIGHT_COLORS, DARK_COLORS } from '../constants/theme';

export const useThemeStore = create(
  persist(
    (set, get) => ({
      isDark: false,
      colors: LIGHT_COLORS,
      toggleTheme: () => {
        const { isDark } = get();
        set({
          isDark: !isDark,
          colors: !isDark ? DARK_COLORS : LIGHT_COLORS,
        });
      },
      setTheme: (isDark) => {
        set({
          isDark,
          colors: isDark ? DARK_COLORS : LIGHT_COLORS,
        });
      },
    }),
    {
      name: 'restaurante-theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.colors = state.isDark ? DARK_COLORS : LIGHT_COLORS;
        }
      },
    }
  )
);
