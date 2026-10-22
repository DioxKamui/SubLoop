// ============================================================================
// Screen.tsx — Contenedor base de pantalla
// ----------------------------------------------------------------------------
// Fondo oscuro + aurora + respeto de las áreas seguras (notch / barra de
// gestos). Todas las pantallas usan este contenedor para mantener consistencia.
// ============================================================================
import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuroraBackground } from '@/components/AuroraBackground';
import { colors, spacing } from '@/constants/theme';

interface ScreenProps extends PropsWithChildren {
  style?: ViewStyle;
}

export function Screen({ children, style }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Fondo aurora detrás del contenido (las tarjetas glass lo dejan ver). */}
      <AuroraBackground />
      <View style={[styles.inner, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    flex: 1,
    padding: spacing.lg,
  },
});
