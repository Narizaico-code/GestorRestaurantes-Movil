import { useCallback, useState } from 'react';

import { authClient, buildFormData, getApiError } from '../../../shared/api';
import { useAuthStore } from '../../../shared/store/authStore';

// Toda la lógica de autenticación. Las screens solo hacen wiring.
export function useAuth() {
  const [loading, setLoading] = useState(false);
  const loginToStore = useAuthStore((state) => state.login);

  const login = useCallback(
    async ({ email, password }) => {
      setLoading(true);
      try {
        const { data } = await authClient.post('/auth/login', { email, password });
        // El backend responde { success, token, userDetails, expiresAt }.
        const token = data?.token || data?.accessToken;
        const user = data?.userDetails || data?.user || null;
        if (!token) {
          return { ok: false, error: 'Respuesta inválida del servidor' };
        }
        await loginToStore({ token, user });
        return { ok: true };
      } catch (error) {
        return { ok: false, error: getApiError(error, 'No se pudo iniciar sesión') };
      } finally {
        setLoading(false);
      }
    },
    [loginToStore]
  );

  // Registro multipart → /auth/register. No devuelve token: requiere verificar el correo.
  const register = useCallback(async (form) => {
    setLoading(true);
    try {
      const formData = await buildFormData(
        {
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
        },
        form.profilePicture ? { uri: form.profilePicture, field: 'profilePicture' } : null
      );
      // NO forzamos Content-Type: Axios/RN ponen el boundary multipart.
      const { data } = await authClient.post('/auth/register', formData);
      return { ok: true, data };
    } catch (error) {
      return { ok: false, error: getApiError(error, 'No se pudo crear la cuenta') };
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyEmail = useCallback(async (token) => {
    setLoading(true);
    try {
      const { data } = await authClient.post('/auth/verify-email', { token });
      return { ok: true, data };
    } catch (error) {
      return { ok: false, error: getApiError(error, 'No se pudo verificar el correo') };
    } finally {
      setLoading(false);
    }
  }, []);

  const resendVerification = useCallback(async (email) => {
    setLoading(true);
    try {
      const { data } = await authClient.post('/auth/resend-verification', { email });
      return { ok: true, data };
    } catch (error) {
      return { ok: false, error: getApiError(error, 'No se pudo reenviar el correo') };
    } finally {
      setLoading(false);
    }
  }, []);

  const forgotPassword = useCallback(async (email) => {
    setLoading(true);
    try {
      const { data } = await authClient.post('/auth/forgot-password', { email });
      return { ok: true, data };
    } catch (error) {
      return { ok: false, error: getApiError(error, 'No se pudo enviar el enlace') };
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (token, newPassword) => {
    setLoading(true);
    try {
      const { data } = await authClient.post('/auth/reset-password', { token, newPassword });
      return { ok: true, data };
    } catch (error) {
      return { ok: false, error: getApiError(error, 'No se pudo restablecer la contraseña') };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    login,
    register,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
  };
}
