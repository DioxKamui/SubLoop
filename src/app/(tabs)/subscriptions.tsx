// ============================================================================
// (tabs)/subscriptions.tsx — Pantalla de servicios
// ----------------------------------------------------------------------------
// En la Fase 2 alojará el CRUD de suscripciones (precio, fecha de cobro,
// prioridad) con un picker del catálogo de servicios.
// ============================================================================
import { StyleSheet, Text } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { colors, type } from '@/constants/theme';

export default function SubscriptionsScreen() {
  return (
    <Screen>
      <Text style={styles.title}>Services</Text>
      <Text style={styles.subtitle}>Your subscriptions will live here.</Text>
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
    marginTop: 8,
  },
});
