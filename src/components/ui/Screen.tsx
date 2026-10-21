// ============================================================================
// Screen.tsx — Contenedor base de pantalla
// ----------------------------------------------------------------------------
// Fondo oscuro + respeto de las áreas seguras (notch / barra de gestos).
// Todas las pantallas usan este contenedor para mantener consistencia.
// ============================================================================
import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '@/constants/theme';

interface ScreenProps extends PropsWithChildren {
  style?: ViewStyle;
}

export function Screen({ children, style }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
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
