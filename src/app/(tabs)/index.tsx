// ============================================================================
// (tabs)/index.tsx — Pantalla de inicio (dashboard)
// ----------------------------------------------------------------------------
// En la Fase 3 alojará el hero de ahorro ("Pay for one service. Not eight.")
// con las cifras animadas y la gráfica mensual.
// ============================================================================
import { StyleSheet, Text } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { colors, type } from '@/constants/theme';

export default function HomeScreen() {
  return (
    <Screen>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.subtitle}>Your savings summary will live here.</Text>
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
