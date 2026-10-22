// ============================================================================
// vitest.config.mts — Configuración de Vitest
// ----------------------------------------------------------------------------
// Usamos extensión .mts (ESM) para que Vite cargue bien la config, y limitamos
// los tests a la lógica pura (`src/**/*.test.ts`) en entorno Node, sin arrastrar
// módulos de React Native.
// ============================================================================
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
