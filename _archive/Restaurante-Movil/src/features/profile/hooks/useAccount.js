import { useCallback, useState } from 'react';

import { authClient, getApiError } from '../../../shared/api';
import { useAuthStore } from '../../../shared/store/authStore';

// Acciones de seguridad de la cuenta: cambiar contraseña y eliminar cuenta.
// Separado de useProfile (que gestiona los datos del perfil) porque son
// operaciones sensibles con su propio flujo de confirmación.
export function useAccount() {
  const [loading, setLoading] = useState(false);
  const logout = useAuthStore((state) => state.logout);

  const changePassword = useCallback(async ({ currentPassword, newPassword }) => {
    setLoading(true);
    try {
      const { data } = await authClient.post('/users/change-password', { currentPassword, newPassword });
      return { ok: true, data };
    } catch (error) {
      return { ok: false, error: getApiError(error, 'No se pudo cambiar la contraseña') };
    } finally {
      setLoading(false);
    }
  }, []);

  // Elimina la cuenta y cierra la sesión local. AppNavigator vuelve a AuthStack solo.
  const deleteAccount = useCallback(async () => {
    setLoading(true);
    try {
      await authClient.delete('/users/account');
      await logout();
      return { ok: true };
    } catch (error) {
      return { ok: false, error: getApiError(error, 'No se pudo eliminar la cuenta') };
    } finally {
      setLoading(false);
    }
  }, [logout]);

  return { loading, changePassword, deleteAccount };
}
