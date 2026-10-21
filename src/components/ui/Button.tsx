// ============================================================================
// Button.tsx — Botón principal reutilizable
// ----------------------------------------------------------------------------
// Da feedback de pulsación, estado de carga y estado deshabilitado. Soporta
// dos variantes: "primary" (relleno con el color de marca) y "ghost"
// (transparente, solo texto).
// ============================================================================
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, spacing, type } from '@/constants/theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'ghost';
}

export function Button({ label, onPress, loading, disabled, variant = 'primary' }: ButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.ghost,
        // Diminuimos la opacidad al pulsar, cargar o deshabilitar.
        (pressed || disabled || loading) && styles.dimmed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.onPrimary : colors.primary} />
      ) : (
        <Text style={[styles.label, { color: isPrimary ? colors.onPrimary : colors.primary }]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52, // >=44pt: cumple el mínimo táctil de accesibilidad
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  dimmed: {
    opacity: 0.6,
  },
  label: {
    fontSize: type.body,
    fontWeight: '600',
  },
});
