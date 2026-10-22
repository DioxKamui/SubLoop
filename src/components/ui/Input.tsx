// ============================================================================
// Input.tsx — Campo de texto con etiqueta y mensaje de error
// ----------------------------------------------------------------------------
// La etiqueta es SIEMPRE visible (no solo placeholder), y el error aparece
// debajo del campo, cerca del problema. Cumple reglas de accesibilidad de
// formularios.
// ============================================================================
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors, fonts, radius, spacing, type } from '@/constants/theme';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

export function Input({ label, error, style, ...rest }: InputProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor={colors.textMuted}
        {...rest}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs,
  },
  label: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: type.body,
  },
  input: {
    minHeight: 52, // >=44pt: mínimo táctil
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text,
    paddingHorizontal: spacing.md,
    fontFamily: fonts.body,
    fontSize: type.body,
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    color: colors.danger,
    fontFamily: fonts.body,
    fontSize: type.caption,
  },
});
