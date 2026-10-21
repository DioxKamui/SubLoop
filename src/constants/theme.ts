// ============================================================================
// theme.ts — Tokens de diseño de SubLoop
// ----------------------------------------------------------------------------
// Aquí viven TODOS los colores, espacios, radios y tamaños de tipografía.
// Ningún componente debe usar valores "sueltos" (hex o números mágicos):
// siempre importa desde este archivo. Así, cambiar la identidad visual es
// tocar un solo lugar.
//
// Identidad: "dinero cinematográfico". Fondo oscuro como las apps de
// streaming, con tres acentos semánticos:
//   - primary (violeta)  → marca y acciones (el "loop")
//   - savings (verde)    → dinero que ahorras (positivo)
//   - waste   (ámbar)    → gasto sin optimizar (la línea base)
// ============================================================================

// Paleta de colores (modo oscuro, el único por ahora en el MVP).
export const colors = {
  // Superficies
  background: '#0A0F1E',       // Fondo general (tinta)
  surface: '#121A30',          // Tarjetas y paneles
  surfaceElevated: '#1A2440',  // Modales, sheets, elementos flotantes
  border: '#232F4D',           // Bordes sutiles

  // Texto
  text: '#E6EAF2',             // Texto principal
  textMuted: '#8B93A7',        // Texto secundario

  // Acentos semánticos
  primary: '#7C3AED',          // Marca / acciones
  onPrimary: '#FFFFFF',        // Texto sobre el acento de marca
  savings: '#10B981',          // "Dinero ahorrado" (positivo)
  waste: '#F59E0B',            // "Gasto sin optimizar" (línea base)
  danger: '#EF4444',           // Acciones destructivas / errores
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

// Fuentes de la identidad. Se cargan con expo-font en una fase posterior;
// por ahora los componentes usan la fuente del sistema y estos nombres son
// la intención final (display para títulos, mono para cifras de dinero).
export const fonts = {
  display: 'SpaceGrotesk',   // Títulos y el hero de ahorro
  body: 'Inter',             // Texto de lectura
  mono: 'JetBrainsMono',     // Cifras (dinero) con ancho fijo
} as const;
