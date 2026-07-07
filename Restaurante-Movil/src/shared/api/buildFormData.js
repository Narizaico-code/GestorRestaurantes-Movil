import { Platform } from 'react-native';

// Helper para multipart/form-data en React Native.
// En RN NO existe el objeto File del navegador: las imágenes de expo-image-picker
// se adjuntan como un objeto nativo { uri, name, type }.

// Deriva { name, type } de la URI manteniendo coherencia con lo que valida Multer.
export const guessImagePart = (uri, baseName = 'photo') => {
  if (!uri) return null;
  const lower = String(uri).toLowerCase();
  let ext = 'jpg';
  let type = 'image/jpeg';
  if (lower.endsWith('.png')) {
    ext = 'png';
    type = 'image/png';
  } else if (lower.endsWith('.jpeg')) {
    ext = 'jpeg';
    type = 'image/jpeg';
  } else if (lower.endsWith('.webp')) {
    ext = 'webp';
    type = 'image/webp';
  }
  return { uri, name: `${baseName}.${ext}`, type };
};

/**
 * Construye un FormData a partir de campos de texto y, opcionalmente, una imagen.
 * @param {Object} fields - pares clave/valor de texto. Los arrays se serializan a JSON.
 *                          Se omiten null/undefined/''.
 * @param {Object} [image] - { uri, field } donde field es el nombre del campo del archivo.
 */
export const buildFormData = async (fields = {}, image = null) => {
  const formData = new FormData();

  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
      return;
    }
    formData.append(key, String(value));
  });

  if (image?.uri) {
    const field = image.field || 'photo';
    if (Platform.OS === 'web') {
      try {
        const response = await fetch(image.uri);
        const blob = await response.blob();
        const ext = image.uri.split('.').pop() || 'jpg';
        const file = new File([blob], `${field}.${ext}`, { type: blob.type });
        formData.append(field, file);
      } catch (err) {
        console.error('Error converting blob URI to file on web:', err);
      }
    } else {
      const part = guessImagePart(image.uri, field);
      if (part) formData.append(field, part);
    }
  }

  return formData;
};
