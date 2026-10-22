// ============================================================================
// queryClient.ts — Cliente de react-query (una sola instancia para la app)
// ----------------------------------------------------------------------------
// Centraliza las opciones por defecto de todas las consultas y además persiste
// la caché en AsyncStorage: así los datos sobreviven al reinicio y se pueden
// leer sin conexión.
// ============================================================================
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000, // 30 segundos antes de considerar los datos obsoletos
      retry: 1,
    },
  },
});

// Persistimos la caché en AsyncStorage (soporte offline).
const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

persistQueryClient({
  queryClient,
  persister: asyncStoragePersister,
  dehydrateOptions: {
    // Solo guardamos consultas exitosas (evita cachear errores transitorios).
    shouldDehydrateQuery: (query) => query.state.status === 'success',
  },
});
