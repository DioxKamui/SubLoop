// ============================================================================
// queryClient.ts — Cliente de react-query (una sola instancia para la app)
// ----------------------------------------------------------------------------
// Centraliza las opciones por defecto de todas las consultas:
//   - staleTime: cuánto tiempo se consideran "frescos" los datos antes de
//     volver a pedirlos (evita refetch innecesario).
//   - retry: reintentos ante un fallo de red.
// ============================================================================
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000, // 30 segundos
      retry: 1,
    },
  },
});
