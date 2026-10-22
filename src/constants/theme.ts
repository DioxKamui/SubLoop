// ============================================================================
// theme.ts — Tokens de diseño de SubLoop
// ----------------------------------------------------------------------------
// Aquí viven TODOS los colores, espacios, radios, tamaños de tipografía y
// fuentes. Ningún componente debe usar valores "sueltos": siempre importa de
// este archivo. Así, cambiar la identidad visual es tocar un solo lugar.
//
// Identidad "Aurora": espacio profundo (casi negro, tono frío) con acentos de
// buen gusto y poco convencionales:
//   - primary (oro)     → marca, acciones y el "loop" (dinero/premium)
//   - savings (aqua)    → dinero que ahorras (positivo, futurista)
//   - waste   (rosa)    → gasto base sin optimizar (contraste cálido)
// ============================================================================

// Paleta de colores (modo oscuro, el único por ahora en el MVP).
export const colors = {
  // Superficies
  background: '#0B0E17',       // Espacio profundo (fondo general)
  surface: '#121828',          // Tarjetas y paneles
  surfaceElevated: '#1A2238',  // Modales, sheets, elementos flotantes
  border: '#242F4A',           // Bordes sutiles

  // Texto
  text: '#F0F3FA',             // Texto principal
  textMuted: '#96A0B8',        // Texto secundario

  // Acentos semánticos
  primary: '#F4B740',          // Oro — marca / acciones / el "loop"
  onPrimary: '#0B0E17',        // Texto oscuro sobre el oro (contraste)
  savings: '#5EEAD4',          // Aqua menta — "dinero ahorrado" (positivo)
  waste: '#FB7185',            // Rosa — "gasto sin optimizar" (línea base)
  danger: '#F43F5E',           // Acciones destructivas / errores
} as const;

// Escala de espaciado base 4/8 (múltiplos de 4), como Material Design.
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// Radios de borde coherentes en toda la app.
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

// Escala tipográfica (tamaños en px lógicos).
export const type = {
  caption: 12,
  body: 16,
  subtitle: 18,
  title: 22,
  heading: 28,
  display: 36,
} as const;

// Fuentes de la identidad (se cargan con expo-font en el layout raíz).
// Space Grotesk para títulos y cifras; Manrope para el texto de lectura.
export const fonts = {
  display: 'SpaceGrotesk_700Bold',      // Títulos grandes y el hero
  displaySemi: 'SpaceGrotesk_600SemiBold',
  body: 'Manrope_400Regular',           // Texto de lectura
  bodyMedium: 'Manrope_500Medium',
  bodySemi: 'Manrope_600SemiBold',      // Énfasis
  number: 'SpaceGrotesk_700Bold',       // Cifras de dinero
} as const;
