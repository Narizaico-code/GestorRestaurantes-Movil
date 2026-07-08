// Tokens de diseño de la app de restaurantes. NADA de colores/espaciados
// hardcodeados fuera de este archivo. Paleta cálida "apetecible" (terracota +
// ámbar + neutros stone) pensada para un gestor de restaurantes.

export const LIGHT_COLORS = {
  // Marca / acento interactivo
  primary: '#C1440E', // terracota: botones, links, estados activos
  primaryDark: '#7C2D12', // marrón profundo de marca
  primaryLight: '#FCEBE2', // tinte claro del acento (contenedores de iconos)
  secondary: '#B45309', // ámbar-700
  secondaryDark: '#78350F',

  // Marrones/terracota de marca (para gradientes/hero/headers)
  brandDeep: '#3B120B',
  brand: '#7C2D12',
  brandMid: '#9A3412',
  brandBright: '#C1440E',
  accentStrong: '#450A0A',

  // Superficies / fondo
  background: '#FBF7F4', // crema cálido
  surface: '#FFFFFF',
  surfaceAlt: '#F6EFEA',
  overlay: 'rgba(59, 18, 11, 0.55)',

  // Texto
  text: '#1C1917', // stone-900
  textSecondary: '#57534E', // stone-600
  textMuted: 'rgba(28, 25, 23, 0.55)',
  textOnPrimary: '#ffffff',

  // Bordes / divisores
  border: 'rgba(28, 25, 23, 0.12)',
  borderStrong: 'rgba(28, 25, 23, 0.22)',

  // Estados (sistema tintado: texto sólido + fondo 15% + borde 30%)
  success: '#15803d', // green-700 (entregado, activo)
  successBg: 'rgba(34, 197, 94, 0.15)',
  successBorder: 'rgba(34, 197, 94, 0.3)',
  danger: '#b91c1c', // red-700 (cancelado, errores)
  dangerBg: 'rgba(239, 68, 68, 0.15)',
  dangerBorder: 'rgba(239, 68, 68, 0.3)',
  warning: '#b45309', // amber-700 (pendiente, en preparación)
  warningBg: 'rgba(245, 158, 11, 0.15)',
  warningBorder: 'rgba(245, 158, 11, 0.3)',
  info: '#0369a1', // sky-700
  infoBg: 'rgba(14, 165, 233, 0.15)',
  infoBorder: 'rgba(14, 165, 233, 0.3)',
  neutral: '#57534E', // stone-600
  neutralBg: 'rgba(120, 113, 108, 0.15)',
  neutralBorder: 'rgba(120, 113, 108, 0.3)',

  // Acento cálido para calificaciones (estrellas)
  star: '#F59E0B',

  // Neutrales utilitarios
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const DARK_COLORS = {
  // Marca / acento interactivo (ajustados para dark mode)
  primary: '#F97316', // orange-500, más claro para contraste
  primaryDark: '#EA580C', // orange-600
  primaryLight: 'rgba(249, 115, 22, 0.2)',
  secondary: '#FBBF24', // amber-400
  secondaryDark: '#F59E0B',

  // Marca - en dark mode se cambian por marrones/stone profundos
  brandDeep: '#1C1917', // stone-900
  brand: '#292524', // stone-800
  brandMid: '#44403C', // stone-700
  brandBright: '#57534E', // stone-600
  accentStrong: '#0C0A09',

  // Superficies / fondo
  background: '#1C1917', // stone-900
  surface: '#292524', // stone-800
  surfaceAlt: '#44403C', // stone-700
  overlay: 'rgba(12, 10, 9, 0.7)',

  // Texto
  text: '#FAFAF9', // stone-50
  textSecondary: '#A8A29E', // stone-400
  textMuted: 'rgba(250, 250, 249, 0.5)',
  textOnPrimary: '#ffffff',

  // Bordes / divisores
  border: 'rgba(250, 250, 249, 0.1)',
  borderStrong: 'rgba(250, 250, 249, 0.2)',

  // Estados
  success: '#22c55e', // green-500
  successBg: 'rgba(34, 197, 94, 0.15)',
  successBorder: 'rgba(34, 197, 94, 0.3)',
  danger: '#ef4444', // red-500
  dangerBg: 'rgba(239, 68, 68, 0.15)',
  dangerBorder: 'rgba(239, 68, 68, 0.3)',
  warning: '#f59e0b', // amber-500
  warningBg: 'rgba(245, 158, 11, 0.15)',
  warningBorder: 'rgba(245, 158, 11, 0.3)',
  info: '#0ea5e9', // sky-500
  infoBg: 'rgba(14, 165, 233, 0.15)',
  infoBorder: 'rgba(14, 165, 233, 0.3)',
  neutral: '#A8A29E', // stone-400
  neutralBg: 'rgba(168, 162, 158, 0.15)',
  neutralBorder: 'rgba(168, 162, 158, 0.3)',

  star: '#FBBF24',

  // Neutrales utilitarios
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

// Gradientes de marca para <LinearGradient />.
export const GRADIENTS = {
  brand: ['#450A0A', '#7C2D12', '#C1440E'], // navbar/headers (horizontal)
  brandLocations: [0, 0.5, 1],
  hero: ['#450A0A', '#7C2D12', '#C1440E'], // fondo de login (diagonal)
  feature: ['#7C2D12', '#C1440E'], // tarjeta destacada (marrón → terracota)
  start: { x: 0, y: 0 },
  endHorizontal: { x: 1, y: 0 },
  endDiagonal: { x: 1, y: 1 },
  endVertical: { x: 0, y: 1 },
};

// Familias tipográficas de marca (cargadas en App.jsx).
// Con fontFamily personalizada, el peso va "horneado" en la familia.
export const FONTS = {
  body: 'SpaceGrotesk_400Regular',
  medium: 'SpaceGrotesk_500Medium',
  semibold: 'SpaceGrotesk_600SemiBold',
  bold: 'SpaceGrotesk_700Bold',
  display: 'Literata_600SemiBold', // títulos serif
  displayBold: 'Literata_700Bold',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const FONT_SIZE = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 34,
};

export const RADIUS = {
  sm: 10,
  md: 12,
  lg: 18,
  xl: 24,
  pill: 999,
};

export const SHADOWS = {
  card: {
    shadowColor: '#3B120B',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 4,
  },
  subtle: {
    shadowColor: '#3B120B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  floating: {
    shadowColor: '#3B120B',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.18,
    shadowRadius: 32,
    elevation: 10,
  },
  brand: {
    shadowColor: '#7C2D12',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 10,
  },
};
