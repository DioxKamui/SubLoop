// ============================================================================
// supabase.ts — Cliente de Supabase (única instancia para toda la app)
// ----------------------------------------------------------------------------
// En React Native hay dos particularidades:
//   1. Pasamos AsyncStorage para persistir la sesión (que no se pierda al
//      cerrar la app).
//   2. Importamos un polyfill de URL, porque RN no trae un URL global nativo.
// ============================================================================
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

// Variables públicas de Expo: llevan el prefijo EXPO_PUBLIC_ para que el
// empaquetador las inyecte en el cliente (se leen desde el archivo .env).
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Fallamos temprano si faltan credenciales: sin ellas la app no puede hablar
// con el backend y es mejor avisar claro que fallar de forma silenciosa.
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan EXPO_PUBLIC_SUPABASE_URL o EXPO_PUBLIC_SUPABASE_ANON_KEY en el archivo .env.',
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,      // guarda la sesión localmente
    autoRefreshToken: true,     // renueva el token JWT automáticamente
    persistSession: true,       // mantiene la sesión entre reinicios
    detectSessionInUrl: false,  // solo aplica en web; en RN no hay URL de sesión
  },
});

// ============================================================================
// getUserId — Devuelve el id del usuario con sesión (o lanza si no hay).
// ----------------------------------------------------------------------------
// Lo usan los hooks al insertar/actualizar: las políticas RLS exigen que
// user_id coincida con auth.uid(), así que siempre lo seteamos explícitamente.
// ============================================================================
export async function getUserId(): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('No autenticado.');
  }
  return user.id;
}
