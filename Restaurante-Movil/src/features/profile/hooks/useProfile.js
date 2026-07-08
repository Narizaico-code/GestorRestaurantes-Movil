import { useCallback, useEffect, useState } from 'react';

import { authClient, buildFormData, getApiError } from '../../../shared/api';
import { useAuthStore } from '../../../shared/store/authStore';

const mapToViewModel = (raw) => ({
  raw,
  id: raw?.id,
  name: raw?.name || '',
  email: raw?.email || '',
  phone: raw?.phone || raw?.UserProfile?.Phone || '',
  address: raw?.UserProfile?.Address || raw?.address || '',
  profilePicture: raw?.profilePicture || null,
  role: raw?.role,
  isEmailVerified: raw?.isEmailVerified,
});

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await authClient.get('/auth/profile');
      const data = res.data?.data || res.data;
      setProfile(mapToViewModel(data));
    } catch (err) {
      setError(getApiError(err, 'No fue posible cargar tu perfil'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // PUT /users/profile (multipart). Requiere name + email; el teléfono debe
  // tener 8 dígitos. `profilePicture` es la URI local de una foto nueva (opcional).
  const updateProfile = useCallback(
    async (form) => {
      try {
        const formData = await buildFormData(
          {
            name: form.name,
            email: form.email,
            phone: form.phone,
            address: form.address,
          },
          form.profilePicture ? { uri: form.profilePicture, field: 'profilePicture' } : null
        );
        const res = await authClient.put('/users/profile', formData);
        // Refleja el nombre en el header (store global).
        setUser({ name: form.name });
        await fetchProfile();
        return { ok: true, data: res.data };
      } catch (err) {
        return { ok: false, error: getApiError(err, 'No fue posible actualizar tu perfil') };
      }
    },
    [fetchProfile, setUser]
  );

  return { profile, loading, error, refetch: fetchProfile, updateProfile, logout };
}
