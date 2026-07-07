import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'accessToken';

// Guarda el token en SecureStore (dato sensible). No bloquea el flujo si falla.
const persistTokenSecurely = async (token) => {
  try {
    if (token) await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch {
    // SecureStore puede no estar disponible (web); el token igual queda en memoria/AsyncStorage.
  }
};

const clearTokenSecurely = async () => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch {
    // noop
  }
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null, // { id, name, email, profilePicture, role }
      isAuthenticated: false,
      _hasHydrated: false,

      // Llamado tras login exitoso: { token, user: userDetails }
      login: async ({ token, user }) => {
        await persistTokenSecurely(token);
        set({ token, user, isAuthenticated: true });
      },

      logout: async () => {
        await clearTokenSecurely();
        set({ token: null, user: null, isAuthenticated: false });
      },

      // Merge parcial del perfil (tras editar).
      setUser: (patch) =>
        set((state) => ({ user: { ...(state.user || {}), ...patch } })),

      setHasHydrated: (value) => set({ _hasHydrated: value }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Solo persistimos lo necesario para rehidratar la sesión.
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Marca la hidratación como completa para el anti-parpadeo del AppNavigator.
        state?.setHasHydrated(true);
      },
    }
  )
);
