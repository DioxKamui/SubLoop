// ============================================================================
// (auth)/_layout.tsx — Navegador del flujo de autenticación
// ----------------------------------------------------------------------------
// Agrupa las pantallas de login y registro. Se muestra cuando NO hay sesión.
// ============================================================================
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
