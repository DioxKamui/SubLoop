// ============================================================================
// (tabs)/plan.tsx — Pantalla del plan de rotación
// ----------------------------------------------------------------------------
// En la Fase 3 alojará la proyección mensual (12 meses) con la gráfica
// comparativa de costo optimizado vs. línea base.
// ============================================================================
import { StyleSheet, Text } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { colors, type } from '@/constants/theme';

export default function PlanScreen() {
  return (
    <Screen>
      <Text style={styles.title}>Plan</Text>
      <Text style={styles.subtitle}>Your monthly rotation plan will live here.</Text>
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
