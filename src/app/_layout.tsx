// ============================================================================
// _layout.tsx — Layout raíz de la app
// ----------------------------------------------------------------------------
// Controla el estado de sesión de Supabase y decide qué rama de rutas mostrar:
//   - Sin sesión → (auth): login y registro.
//   - Con sesión → (tabs): la app principal.
// Además envuelve todo con QueryClientProvider (caché de datos) y mantiene el
// splash visible hasta que sepamos si hay sesión.
// ============================================================================
import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import type { Session } from '@supabase/supabase-js';
import { QueryClientProvider } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import { queryClient } from '@/lib/queryClient';

// Evitamos que el splash se oculte automáticamente; lo ocultamos nosotros
// cuando ya sabemos si el usuario tiene sesión.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Al montar: leemos la sesión guardada (si existe) y nos suscribimos a los
    // cambios (login/logout) para re-renderizar el árbol de rutas.
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    // Al desmontar, cancelamos la suscripción para no filtrar memoria.
    return () => subscription.subscription.unsubscribe();
  }, []);

  // Ocultamos el splash solo cuando ya resolvimos la sesión.
  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync();
    }
  }, [ready]);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Según haya sesión, mostramos una rama u otra del árbol de rutas. */}
        {session ? <Stack.Screen name="(tabs)" /> : <Stack.Screen name="(auth)" />}
      </Stack>
    </QueryClientProvider>
  );
}
