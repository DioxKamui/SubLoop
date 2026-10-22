// ============================================================================
// _layout.tsx — Layout raíz de la app
// ----------------------------------------------------------------------------
// Controla el estado de sesión de Supabase y decide qué rama de rutas mostrar:
//   - Sin sesión → (auth): login y registro.
//   - Con sesión → (tabs): la app principal.
// Además: carga las fuentes de la identidad, envuelve todo con
// QueryClientProvider y mantiene el splash hasta que haya sesión + fuentes.
// ============================================================================
import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import type { Session } from '@supabase/supabase-js';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
} from '@expo-google-fonts/manrope';

import { supabase } from '@/lib/supabase';
import { queryClient } from '@/lib/queryClient';

// Evitamos que el splash se oculte automáticamente; lo ocultamos nosotros
// cuando ya sabemos si hay sesión y las fuentes están cargadas.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionReady, setSessionReady] = useState(false);

  // Carga las fuentes de la identidad visual.
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
  });

  useEffect(() => {
    // Al montar: leemos la sesión guardada (si existe) y nos suscribimos a los
    // cambios (login/logout) para re-renderizar el árbol de rutas.
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setSessionReady(true);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    // Al desmontar, cancelamos la suscripción para no filtrar memoria.
    return () => subscription.subscription.unsubscribe();
  }, []);

  // Ocultamos el splash solo cuando la sesión y las fuentes están listas.
  useEffect(() => {
    if (sessionReady && fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [sessionReady, fontsLoaded]);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Según haya sesión, mostramos una rama u otra del árbol de rutas. */}
        {session ? <Stack.Screen name="(tabs)" /> : <Stack.Screen name="(auth)" />}
      </Stack>
    </QueryClientProvider>
  );
}
