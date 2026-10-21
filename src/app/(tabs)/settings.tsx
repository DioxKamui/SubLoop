// ============================================================================
// (tabs)/settings.tsx — Pantalla de ajustes
// ----------------------------------------------------------------------------
// En la Fase 2 alojará el presupuesto mensual, la moneda y las preferencias de
// notificación. Por ahora incluye el cierre de sesión para probar el flujo.
// ============================================================================
import { StyleSheet, Text } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { colors, spacing, type } from '@/constants/theme';

export default function SettingsScreen() {
  // Cierra sesión; el layout raíz detecta el cambio y vuelve a (auth).
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Screen>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Budget, notifications, and currency will live here.</Text>

      <Button label="Sign out" onPress={signOut} variant="ghost" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: type.heading,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: type.body,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
});
