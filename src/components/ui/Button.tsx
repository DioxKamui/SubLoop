// ============================================================================
// Button.tsx — Botón principal reutilizable
// ----------------------------------------------------------------------------
// Da feedback de pulsación, estado de carga y estado deshabilitado. Soporta
// dos variantes: "primary" (gradiente dorado) y "ghost" (transparente).
// ============================================================================
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, fonts, gradients, radius, spacing, type } from '@/constants/theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'ghost';
}

export function Button({ label, onPress, loading, disabled, variant = 'primary' }: ButtonProps) {
  const isPrimary = variant === 'primary';

  const content = loading ? (
    <ActivityIndicator color={isPrimary ? colors.onPrimary : colors.primary} />
  ) : (
    <Text style={[styles.label, { color: isPrimary ? colors.onPrimary : colors.primary }]}>
      {label}
    </Text>
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        // Diminuimos la opacidad al pulsar, cargar o deshabilitar.
        (pressed || disabled || loading) && styles.dimmed,
      ]}
    >
      {isPrimary ? (
        <LinearGradient colors={gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.fill}>
          {content}
        </LinearGradient>
      ) : (
        <View style={styles.fill}>{content}</View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52, // >=44pt: cumple el mínimo táctil de accesibilidad
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  fill: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  dimmed: {
    opacity: 0.6,
  },
  label: {
    fontFamily: fonts.bodySemi,
    fontSize: type.body,
  },
});
