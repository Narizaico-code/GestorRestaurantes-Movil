// Validaciones de formulario reutilizables (registro, cambio de contraseña, edición de perfil...).

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (value) => EMAIL_REGEX.test(String(value || '').trim());

// Cada regla se evalúa por separado para poder mostrarlas como checklist en vivo
// (ver PasswordRulesChecklist). Requisitos: mínimo 8 caracteres, mayúscula,
// minúscula y un carácter especial.
export const PASSWORD_RULES = [
  { id: 'minLength', label: 'Al menos 8 caracteres', test: (v) => v.length >= 8 },
  { id: 'uppercase', label: 'Una letra mayúscula', test: (v) => /[A-Z]/.test(v) },
  { id: 'lowercase', label: 'Una letra minúscula', test: (v) => /[a-z]/.test(v) },
  { id: 'special', label: 'Un carácter especial (!@#$%^&*...)', test: (v) => /[^A-Za-z0-9]/.test(v) },
];

export const getUnmetPasswordRules = (value = '') => PASSWORD_RULES.filter((rule) => !rule.test(value));

export const isValidPassword = (value = '') => getUnmetPasswordRules(value).length === 0;
