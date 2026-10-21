// ============================================================================
// (tabs)/watchlist.tsx — Pantalla de watchlist
// ----------------------------------------------------------------------------
// En la Fase 2 alojará la lista de títulos que quieres ver, asociada a cada
// servicio. Alimenta el algoritmo de rotación.
// ============================================================================
import { StyleSheet, Text } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { colors, type } from '@/constants/theme';

export default function WatchlistScreen() {
  return (
    <Screen>
      <Text style={styles.title}>Watchlist</Text>
      <Text style={styles.subtitle}>Titles you want to watch will live here.</Text>
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
