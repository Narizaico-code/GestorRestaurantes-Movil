import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'accessToken';

// Guarda el token en SecureStore (dato sensible). No bloquea el flujo si falla.
const persistTokenSecurely = async (token) => {
  try {
    if (token) await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch {
    // SecureStore puede no estar disponible (p. ej. web); el token igual queda en memoria.
  }
};

const clearTokenSecurely = async () => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch {
    // noop
  }
};

// Lee el token cifrado desde SecureStore (para rehidratar la sesión al abrir la app).
const readTokenSecurely = async () => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
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

      // Reinyecta el token en memoria (usado al rehidratar desde SecureStore).
      setToken: (token) => set({ token }),

      setHasHydrated: (value) => set({ _hasHydrated: value }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // El token NO se persiste en AsyncStorage: es un dato sensible y vive SOLO
      // en SecureStore (cifrado). Aquí solo va lo no sensible para rehidratar.
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => async (state) => {
        // El token se rehidrata desde SecureStore (no desde AsyncStorage) y se
        // reinyecta al store en memoria.
        const token = await readTokenSecurely();
        if (token) {
          state?.setToken(token);
        } else if (state?.isAuthenticated) {
          // Sesión marcada como activa pero sin token cifrado (keystore borrado,
          // reinstalación parcial, etc.): forzamos un estado no autenticado limpio.
          await state?.logout();
        }
        // Marca la hidratación como completa (anti-parpadeo del AppNavigator) SOLO
        // tras resolver el token, para no decidir la navegación sin él.
        state?.setHasHydrated(true);
      },
    }
  )
);
