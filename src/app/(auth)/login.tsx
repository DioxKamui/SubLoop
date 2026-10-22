// ============================================================================
// login.tsx — Pantalla de inicio de sesión
// ----------------------------------------------------------------------------
// Valida con zod y autentica con Supabase. También ofrece un modo demo de un
// clic. No hacemos redirección manual: el layout raíz detecta la nueva sesión
// y cambia a (tabs) automáticamente.
// ============================================================================
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { supabase } from '@/lib/supabase';
import { loginToDemo } from '@/lib/demo';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { colors, fonts, spacing, type } from '@/constants/theme';

// Esquema de validación: correo válido y contraseña con mínimo de caracteres.
const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'At least 6 characters'),
});
type FormValues = z.infer<typeof schema>;

export default function LoginScreen() {
  // Error de autenticación (credenciales inválidas, red, etc.).
  const [error, setError] = useState<string | null>(null);
  const [demoLoading, setDemoLoading] = useState(false);

  const { control, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    const { error: authError } = await supabase.auth.signInWithPassword(values);
    if (authError) setError(authError.message);
  };

  // Entra a la cuenta demo y siembra datos de ejemplo.
  const onDemo = async () => {
    setError(null);
    setDemoLoading(true);
    try {
      await loginToDemo();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not start the demo.');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <Screen>
      {/* Cabecera con la identidad de marca. */}
      <View style={styles.header}>
        <Text style={styles.title}>SubLoop</Text>
        <Text style={styles.subtitle}>Pay for one service. Not eight.</Text>
      </View>

      <View style={styles.form}>
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <Input
              label="Email"
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              value={field.value}
              onChangeText={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <Input
              label="Password"
              placeholder="••••••••"
              secureTextEntry
              autoComplete="password"
              value={field.value}
              onChangeText={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button label="Log in" onPress={handleSubmit(onSubmit)} loading={formState.isSubmitting} />

        <Text style={styles.or}>or</Text>

        <Button label="Try the demo" onPress={onDemo} loading={demoLoading} variant="ghost" />
      </View>

      <Link href="/register" style={styles.link}>
        Don&apos;t have an account? Sign up
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.xs,
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: type.display,
  },
  subtitle: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: type.subtitle,
  },
  form: {
    gap: spacing.md,
  },
  error: {
    color: colors.danger,
    fontFamily: fonts.body,
    fontSize: type.body,
  },
  or: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: type.caption,
    textAlign: 'center',
  },
  link: {
    color: colors.primary,
    fontFamily: fonts.bodyMedium,
    fontSize: type.body,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
